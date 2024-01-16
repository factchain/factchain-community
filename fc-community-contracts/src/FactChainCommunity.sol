//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {stdMath} from "forge-std/StdMath.sol";
import "./utils/Ownable.sol";

interface IFactChainCommunityEvents {
    /// @dev This emits when a the Owner funds the reserve
    event ReserveFunded(uint256 amount);
    /// @dev This emits when a new Note is created
    event NoteCreated(string postUrl, address indexed creator, uint256 stake);
    /// @dev This emits when a Note was rated
    event NoteRated(
        string postUrl, address indexed creator, address indexed rater, uint8 indexed rating, uint256 stake
    );
    /// @dev This emits when a Rater is rewarded
    event RaterRewarded(string postUrl, address indexed creator, address indexed rater, uint256 reward, uint256 stake);
    /// @dev This emits when a Rater is slashed
    event RaterSlashed(string postUrl, address indexed creator, address indexed rater, uint256 slash, uint256 stake);
    /// @dev This emits when a Rater is rewarded
    event CreatorRewarded(string postUrl, address indexed creator, uint256 reward, uint256 stake);
    /// @dev This emits when a Rater is slashed
    event CreatorSlashed(string postUrl, address indexed creator, uint256 slash, uint256 stake);
    /// @dev This emits when a Note was finalised
    event NoteFinalised(string postUrl, address indexed creator, uint8 indexed finalRating);
}

interface IFactChainCommunity is IFactChainCommunityEvents {
    /// @notice Note structure
    /// @param postUrl URL of the post targeted by this Note
    /// @param content Content of the Note
    /// @param creator Address of the Note's creator
    /// @param finalRating Final rating attributed by FactChain
    struct Note {
        string postUrl;
        string content;
        address creator;
        uint8 finalRating;
    }

    /// @notice UserStats structure
    /// @param postUrl URL of the post targeted by this Note
    /// @param content Content of the Note
    /// @param creator Address of the Note's creator
    /// @param finalRating Final rating attributed by FactChain
    struct UserStats {
        uint32 numberNotes;
        uint32 numberRatings;
        uint96 ethRewarded;
        uint96 ethSlashed;
    }

    /// Errors
    error PostUrlInvalid();
    error ContentInvalid();
    error RatingInvalid();
    error NoteAlreadyExists();
    error NoteDoesNotExist();
    error NoteAlreadyFinalised();
    error RatingAlreadyExists();
    error CantRateOwnNote();
    error FailedToReward();
    error FailedToSlash();
    error InsufficientStake();
}

/// @title FactChain Community
/// @author Yacine B. Badiss, Pierre HAY
/// @notice
/// @dev
contract FactChainCommunity is Ownable, IFactChainCommunity {
    uint8 internal constant POST_URL_MAX_LENGTH = 160;
    uint16 internal constant CONTENT_MAX_LENGTH = 500;
    uint16 internal constant MINIMUM_STAKE_PER_RATING = 10_000;
    uint32 internal constant MINIMUM_STAKE_PER_NOTE = 100_000;

    /// @notice Mapping of note identifier (postUrl + creatorAddress) to Note object
    mapping(string => mapping(address => Note)) public communityNotes;

    /// @notice Mapping of note identifier (postUrl + creatorAddress) to ratings by each rater
    mapping(string => mapping(address => mapping(address => uint8))) public communityRatings;

    /// @notice Mapping of note identifier (postUrl + creatorAddress) to rater addresses
    mapping(string => mapping(address => address[])) public noteRaters;

    /// @notice Mapping of user address to their Factchain stats
    /// TODO: Storing stats on chain is ok for now on testnet, but will be removed
    /// before moving to mainnet and replaced by an indexing of contract events.
    /// It costs an extra 20k gas per call to createNote/rateNote
    mapping(address => UserStats) public userStats;

    /// @notice Mapping of note identifier (postUrl + creatorAddress) to NFT
    mapping(string => mapping(address => uint256)) public nftIDs;

    /// @notice Instantiate a new contract and set its owner
    /// @param _owner Owner of the contract
    constructor(address _owner) Ownable(_owner) {}

    ////////////////////////////////////////////////////////////////////////
    /// Helper functions
    ////////////////////////////////////////////////////////////////////////

    function isPostUrlValid(bytes memory _postUrl) internal pure returns (bool) {
        return _postUrl.length > 0 && _postUrl.length <= POST_URL_MAX_LENGTH;
    }

    function isContentValid(bytes memory _content) internal pure returns (bool) {
        return _content.length > 0 && _content.length <= CONTENT_MAX_LENGTH;
    }

    function isRatingValid(uint8 _rating) internal pure returns (bool) {
        return _rating > 0 && _rating <= 5;
    }

    function noteExists(string memory _postUrl, address _creator) internal view returns (bool) {
        return bytes(communityNotes[_postUrl][_creator].postUrl).length > 0;
    }

    function ratingExists(string memory _postUrl, address _creator, address _rater) internal view returns (bool) {
        return isRatingValid(communityRatings[_postUrl][_creator][_rater]);
    }

    function isNoteFinalised(string memory _postUrl, address _creator) internal view returns (bool) {
        return communityNotes[_postUrl][_creator].finalRating > 0;
    }

    ////////////////////////////////////////////////////////////////////////
    /// Balance updates
    ////////////////////////////////////////////////////////////////////////

    function rewardOrSlashCreator(string memory _postUrl, address _creator) internal {
        uint8 finalRating = communityNotes[_postUrl][_creator].finalRating;
        if (finalRating >= 3) {
            uint96 reward = uint96(finalRating - 2) * 10;
            // This will revert if contract current balance
            // (address(this).balance) < MINIMUM_STAKE_PER_NOTE + reward
            (bool result,) = payable(_creator).call{value: MINIMUM_STAKE_PER_NOTE + reward}("");
            if (!result) revert FailedToReward();

            userStats[_creator].ethRewarded += reward;
            emit CreatorRewarded({postUrl: _postUrl, creator: _creator, reward: reward, stake: MINIMUM_STAKE_PER_NOTE});
        } else if (finalRating < 2) {
            uint96 slash = finalRating * 10;
            // This will revert if contract current balance
            // (address(this).balance) < MINIMUM_STAKE_PER_NOTE - slash
            (bool result,) = payable(_creator).call{value: MINIMUM_STAKE_PER_NOTE - slash}("");
            if (!result) revert FailedToSlash();
            
            userStats[_creator].ethSlashed += slash;
            emit CreatorSlashed({postUrl: _postUrl, creator: _creator, slash: slash, stake: MINIMUM_STAKE_PER_NOTE});
        }
    }

    function rewardOrSlashRaters(string memory _postUrl, address _creator) internal {
        uint8 finalRating = communityNotes[_postUrl][_creator].finalRating;
        for (uint256 index = 0; index < noteRaters[_postUrl][_creator].length; index++) {
            address rater = noteRaters[_postUrl][_creator][index];
            uint96 delta = uint96(stdMath.delta(finalRating, communityRatings[_postUrl][_creator][rater]));
            if (delta < 2) {
                uint96 reward = 2 - delta;
                // This will revert if contract current balance
                // (address(this).balance) < MINIMUM_STAKE_PER_RATING + reward
                (bool result,) = payable(rater).call{value: MINIMUM_STAKE_PER_RATING + reward}("");
                if (!result) revert FailedToReward();

                userStats[rater].ethRewarded += reward;
                emit RaterRewarded({
                    postUrl: _postUrl,
                    creator: _creator,
                    rater: rater,
                    reward: reward,
                    stake: MINIMUM_STAKE_PER_RATING
                });
            } else if (delta > 2) {
                uint96 slash = delta - 2;
                // This will revert if contract current balance
                // (address(this).balance) < MINIMUM_STAKE_PER_RATING - slash
                (bool result,) = payable(rater).call{value: MINIMUM_STAKE_PER_RATING - slash}("");
                if (!result) revert FailedToSlash();

                userStats[rater].ethSlashed += slash;
                emit RaterSlashed({
                    postUrl: _postUrl,
                    creator: _creator,
                    rater: rater,
                    slash: slash,
                    stake: MINIMUM_STAKE_PER_RATING
                });
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////
    /// User actions
    ////////////////////////////////////////////////////////////////////////

    /// @notice Create a new note
    function createNote(string memory _postUrl, string memory _content) external payable {
        if (msg.value != MINIMUM_STAKE_PER_NOTE) revert InsufficientStake();
        if (!isPostUrlValid(bytes(_postUrl))) revert PostUrlInvalid();
        if (!isContentValid(bytes(_content))) revert ContentInvalid();
        if (noteExists(_postUrl, msg.sender)) revert NoteAlreadyExists();

        communityNotes[_postUrl][msg.sender] =
            Note({postUrl: _postUrl, content: _content, creator: msg.sender, finalRating: 0});

        userStats[msg.sender].numberNotes += 1;
        emit NoteCreated({postUrl: _postUrl, creator: msg.sender, stake: MINIMUM_STAKE_PER_NOTE});
    }

    /// @notice Rate an existing note
    function rateNote(string memory _postUrl, address _creator, uint8 _rating) external payable {
        if (msg.value != MINIMUM_STAKE_PER_RATING) revert InsufficientStake();
        if (!isRatingValid(_rating)) revert RatingInvalid();
        if (_creator == msg.sender) revert CantRateOwnNote();
        if (!noteExists(_postUrl, _creator)) revert NoteDoesNotExist();
        if (isNoteFinalised(_postUrl, _creator)) revert NoteAlreadyFinalised();
        if (ratingExists(_postUrl, _creator, msg.sender)) revert RatingAlreadyExists();

        communityRatings[_postUrl][_creator][msg.sender] = _rating;
        noteRaters[_postUrl][_creator].push(msg.sender);

        userStats[msg.sender].numberRatings += 1;
        emit NoteRated({
            postUrl: _postUrl,
            creator: _creator,
            rater: msg.sender,
            rating: _rating,
            stake: MINIMUM_STAKE_PER_RATING
        });
    }

    ////////////////////////////////////////////////////////////////////////
    /// Owner actions
    ////////////////////////////////////////////////////////////////////////

    // @notice Fund the contract
    receive() external payable onlyOwner {
        emit ReserveFunded(msg.value);
    }

    /// @notice Finalise a note
    function finaliseNote(string memory _postUrl, address _creator, uint8 _finalRating) external onlyOwner {
        if (!isRatingValid(_finalRating)) revert RatingInvalid();
        if (!noteExists(_postUrl, _creator)) revert NoteDoesNotExist();
        if (isNoteFinalised(_postUrl, _creator)) revert NoteAlreadyFinalised();

        communityNotes[_postUrl][_creator].finalRating = _finalRating;
        rewardOrSlashCreator(_postUrl, _creator);
        rewardOrSlashRaters(_postUrl, _creator);
        emit NoteFinalised({postUrl: _postUrl, creator: _creator, finalRating: _finalRating});
    }
}
