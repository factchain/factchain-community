//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.19;

import { stdMath } from "forge-std/StdMath.sol";
import "./utils/Ownable.sol";

interface ITrueMintCommunityEvents {
    /// @dev This emits when a the Owner funds the reserve
    event ReserveFunded(uint256 amount);
    /// @dev This emits when a User stakes funds into the contract
    event UserHasStaked(address indexed staker, uint256 amount);
    /// @dev This emits when a new Note is created
    event NoteCreated(string indexed postUrl, address indexed creator);
    /// @dev This emits when a Note was rated
    event NoteRated(string indexed postUrl, address indexed creator, address indexed rater, uint8 rating);
    /// @dev This emits when a User is rewarded
    event UserRewarded(string indexed postUrl, address indexed creator, address indexed rater, uint256 reward);
    /// @dev This emits when a User is slashed
    event UserSlashed(string indexed postUrl, address indexed creator, address indexed rater, uint256 slash);
    /// @dev This emits when a Note was finalised
    event NoteFinalised(string indexed postUrl, address indexed creator, uint8 finalRating);
}

interface ITrueMintCommunity is ITrueMintCommunityEvents {
    /// @notice Note structure
    /// @param postUrl URL of the post targeted by this Note
    /// @param content Content of the Note
    /// @param creator Address of the Note's creator
    /// @param finalRating Final rating attributed by TrueMint
    struct Note {
        string postUrl;
        string content;
        address creator;
        uint8 finalRating;
    }

    /// Errors
    error UserHasNoStake();
    error PostUrlInvalid();
    error ContentInvalid();
    error RatingInvalid();
    error NoteAlreadyExists();
    error NoteDoesNotExist();
    error NoteAlreadyFinalised();
    error RatingAlreadyExists();
    error CantRateOwnNote();
}

/// @title TrueMint Community
/// @author Yacine B. Badiss
/// @notice 
/// @dev 
contract TrueMintCommunity is Ownable, ITrueMintCommunity {
    address internal constant RESERVE_ADDRESS = 0x0000000000000000000000000000000000000000;
    uint8 internal constant POST_URL_MAX_LENGTH = 160;
    uint16 internal constant CONTENT_MAX_LENGTH = 500;

    /// @notice Tracks balances staked by each user
    mapping(address => uint256) public stakedBalances;

    /// @notice Map of community notes
    mapping(string => mapping(address => Note)) public communityNotes;

    /// @notice Map of community ratings
    mapping(string => mapping(address => mapping(address => uint8))) public communityRatings;

    /// @notice List of raters
    mapping(string => mapping(address => address[])) public noteRaters;

    /// @notice Instantiate a new contract and set its owner
    /// @param _owner Owner of the contract
    constructor(address _owner)
        Ownable(_owner)
    {}

    ////////////////////////////////////////////////////////////////////////
    /// Helper functions
    ////////////////////////////////////////////////////////////////////////

    /// @notice Modifier to only allow Users with stake to take an action
    modifier onlyStaker {
        if (stakedBalances[msg.sender] <= 0) revert UserHasNoStake();
        _;
    }

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

    function updateRatersBalance(string memory _postUrl, address _creator) internal {
        uint8 finalRating = communityNotes[_postUrl][_creator].finalRating;

        for (uint256 index = 0; index < noteRaters[_postUrl][_creator].length; index++) {
            address rater = noteRaters[_postUrl][_creator][index];
            // The closer the rater's rating and the final rating are, the higher
            // the update. If the two ratings are too far appart, the update becomes negative
            // effectively slashing.
            int256 update = 2 - int256(stdMath.delta(finalRating, communityRatings[_postUrl][_creator][rater]));
            if (update > 0) {
                uint256 reward = uint256(update);
                // If we don't have enough funds in the reserve, this will revert.
                // This could be improved by first slashing all that need slashing, then rewarding,
                // thus maximising the chance that we have enough funds. But realistically we just
                // need to have enough funds at any given time in our reserve.
                stakedBalances[RESERVE_ADDRESS] -= reward;
                stakedBalances[rater] += reward;

                emit UserRewarded({
                    postUrl: _postUrl,
                    creator: _creator,
                    rater: rater,
                    reward: reward
                });
            } else if (update < 0) {
                // We slash the staker as much as we can
                uint256 slash = stdMath.abs(update) > stakedBalances[rater] ? stakedBalances[rater] : stdMath.abs(update);
                stakedBalances[RESERVE_ADDRESS] += slash;
                stakedBalances[rater] -= slash;

                emit UserSlashed({
                    postUrl: _postUrl,
                    creator: _creator,
                    rater: rater,
                    slash: slash
                });
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////
    /// User actions
    ////////////////////////////////////////////////////////////////////////

    receive() external payable {
        if (msg.sender == owner) {
            stakedBalances[RESERVE_ADDRESS] += msg.value;
            emit ReserveFunded(msg.value);
        } else {
            stakedBalances[msg.sender] += msg.value;
            emit UserHasStaked(msg.sender, msg.value);
        }
    }

    /// @notice Create a new note
    function createNote(string memory _postUrl, string memory _content) external onlyStaker {
        if (!isPostUrlValid(bytes(_postUrl))) revert PostUrlInvalid();
        if (!isContentValid(bytes(_content))) revert ContentInvalid();
        if (noteExists(_postUrl, msg.sender)) revert NoteAlreadyExists();
        
        communityNotes[_postUrl][msg.sender] = Note({
            postUrl: _postUrl,
            content: _content,
            creator: msg.sender,
            finalRating: 0
        });
        emit NoteCreated({
            postUrl: _postUrl,
            creator: msg.sender
        });
    }

    /// @notice Rate an existing note
    function rateNote(string memory _postUrl, address _creator, uint8 _rating) external onlyStaker {
        if (!isRatingValid(_rating)) revert RatingInvalid();
        if (_creator == msg.sender) revert CantRateOwnNote();
        if (!noteExists(_postUrl, _creator)) revert NoteDoesNotExist();
        if (isNoteFinalised(_postUrl, _creator)) revert NoteAlreadyFinalised();
        if (ratingExists(_postUrl, _creator, msg.sender)) revert RatingAlreadyExists();

        communityRatings[_postUrl][_creator][msg.sender] = _rating;
        noteRaters[_postUrl][_creator].push(msg.sender);
        emit NoteRated({
            postUrl: _postUrl,
            creator: _creator,
            rater: msg.sender,
            rating: _rating
        });
    }

    ////////////////////////////////////////////////////////////////////////
    /// Owner actions
    ////////////////////////////////////////////////////////////////////////

    /// @notice Finalise a note
    function finaliseNote(string memory _postUrl, address _creator, uint8 _finalRating) external onlyOwner {
        if (!isRatingValid(_finalRating)) revert RatingInvalid();
        if (!noteExists(_postUrl, _creator)) revert NoteDoesNotExist();
        if (isNoteFinalised(_postUrl, _creator)) revert NoteAlreadyFinalised();

        communityNotes[_postUrl][_creator].finalRating = _finalRating;
        updateRatersBalance(_postUrl, _creator);
        emit NoteFinalised({
            postUrl: _postUrl,
            creator: _creator,
            finalRating: _finalRating
        });
    }
}
