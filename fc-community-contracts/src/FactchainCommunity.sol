//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {stdMath} from "forge-std/StdMath.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

interface IFactchainCommunityEvents {
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
    /// @dev This emits when the minimum stake per note is updated
    event MinimumStakePerNoteUpdated(uint64 newMinimumStake);
    /// @dev This emits when the minimum stake per rating is updated
    event MinimumStakePerRatingUpdated(uint64 newMinimumStake);
}

interface IFactchainCommunity is IFactchainCommunityEvents {
    /// @notice Note structure
    /// @param postUrl URL of the post targeted by this Note
    /// @param content Content of the Note
    /// @param creator Address of the Note's creator
    /// @param finalRating Final rating attributed by Factchain
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
    /// @param finalRating Final rating attributed by Factchain
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

/// @title Factchain Community
/// @author Yacine B. Badiss, Pierre HAY
/// @notice
/// @dev
contract FactchainCommunity is Initializable, OwnableUpgradeable, AccessControlUpgradeable, UUPSUpgradeable, IFactchainCommunity {
    uint8 internal constant POST_URL_MAX_LENGTH = 160;
    uint16 internal constant CONTENT_MAX_LENGTH = 500;
    bytes32 public constant FINALISER_ROLE = keccak256("FINALISER_ROLE");

    uint64 public minimumStakePerNote;
    uint64 public minimumStakePerRating;

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

    // disable contract until initialization
    constructor() {
        _disableInitializers();
    }

    /// @notice Initialize the contract, setting its initial owner. Called only once.
    /// @param initialOwner initialOwner of the contract
    function initialize(address initialOwner) public initializer {
        minimumStakePerNote = 1_000_000_000_000_000;
        minimumStakePerRating = 100_000_000_000_000;
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address /* newImplementation */ ) internal view override onlyOwner {}

    ////////////////////////////////////////////////////////////////////////
    /// Getter functions
    ////////////////////////////////////////////////////////////////////////

    function getNoteRaters(string memory _postUrl, address _creator) public view virtual returns (address[] memory) {
        return noteRaters[_postUrl][_creator];
    }

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
        if (finalRating == 1) {
            // slash = minimumStakePerNote
            // skipping refund
            userStats[_creator].ethSlashed += minimumStakePerNote;
            emit CreatorSlashed({
                postUrl: _postUrl,
                creator: _creator,
                slash: minimumStakePerNote,
                stake: minimumStakePerNote
            });
        } else if (finalRating == 2) {
            // trick to avoid floating point slash=0.75 * minimumStakePerNote
            uint96 slash = minimumStakePerNote - minimumStakePerNote / 4;
            userStats[_creator].ethSlashed += slash;
            (bool result,) = payable(_creator).call{value: minimumStakePerNote - slash}("");
            if (!result) revert FailedToSlash();
            emit CreatorSlashed({postUrl: _postUrl, creator: _creator, slash: slash, stake: minimumStakePerNote});
        } else {
            uint96 reward;
            if (finalRating == 3) reward = minimumStakePerNote / 2;
            if (finalRating == 4) reward = minimumStakePerNote;
            if (finalRating == 5) reward = minimumStakePerNote + minimumStakePerNote / 2;
            userStats[_creator].ethRewarded += reward;
            (bool result,) = payable(_creator).call{value: minimumStakePerNote + reward}("");
            if (!result) revert FailedToReward();
            emit CreatorRewarded({postUrl: _postUrl, creator: _creator, reward: reward, stake: minimumStakePerNote});
        }
    }

    function rewardOrSlashRaters(string memory _postUrl, address _creator) internal {
        uint8 finalRating = communityNotes[_postUrl][_creator].finalRating;
        for (uint256 index = 0; index < noteRaters[_postUrl][_creator].length; index++) {
            address rater = noteRaters[_postUrl][_creator][index];
            uint96 delta = uint96(stdMath.delta(finalRating, communityRatings[_postUrl][_creator][rater]));
            if (delta < 2) {
                uint96 reward;
                if (delta == 0) reward = minimumStakePerRating + minimumStakePerRating / 2;
                if (delta == 1) reward = minimumStakePerRating;
                userStats[rater].ethRewarded += reward;
                (bool result,) = payable(rater).call{value: minimumStakePerRating + reward}("");
                if (!result) revert FailedToReward();
                emit RaterRewarded({
                    postUrl: _postUrl,
                    creator: _creator,
                    rater: rater,
                    reward: reward,
                    stake: minimumStakePerRating
                });
            } else if (delta == 4) {
                // worst slash, skip refund
                userStats[rater].ethSlashed += minimumStakePerRating;
                emit RaterSlashed({
                    postUrl: _postUrl,
                    creator: _creator,
                    rater: rater,
                    slash: minimumStakePerRating,
                    stake: minimumStakePerRating
                });
            } else {
                uint96 slash;
                if (delta == 3) slash = minimumStakePerRating - minimumStakePerRating / 4;
                if (delta == 2) slash = minimumStakePerRating / 2;
                userStats[rater].ethSlashed += slash;
                (bool result,) = payable(rater).call{value: minimumStakePerRating - slash}("");
                if (!result) revert FailedToSlash();
                emit RaterSlashed({
                    postUrl: _postUrl,
                    creator: _creator,
                    rater: rater,
                    slash: slash,
                    stake: minimumStakePerRating
                });
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////
    /// User actions
    ////////////////////////////////////////////////////////////////////////

    /// @notice Create a new note
    function createNote(string memory _postUrl, string memory _content) external payable {
        if (msg.value != minimumStakePerNote) revert InsufficientStake();
        if (!isPostUrlValid(bytes(_postUrl))) revert PostUrlInvalid();
        if (!isContentValid(bytes(_content))) revert ContentInvalid();
        if (noteExists(_postUrl, msg.sender)) revert NoteAlreadyExists();

        communityNotes[_postUrl][msg.sender] =
            Note({postUrl: _postUrl, content: _content, creator: msg.sender, finalRating: 0});

        userStats[msg.sender].numberNotes += 1;
        emit NoteCreated({postUrl: _postUrl, creator: msg.sender, stake: minimumStakePerNote});
    }

    /// @notice Rate an existing note
    function rateNote(string memory _postUrl, address _creator, uint8 _rating) external payable {
        if (msg.value != minimumStakePerRating) revert InsufficientStake();
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
            stake: minimumStakePerRating
        });
    }

    ////////////////////////////////////////////////////////////////////////
    /// Owner actions
    ////////////////////////////////////////////////////////////////////////

    function _transferOwnership(address newOwner) override internal virtual {
        super._transferOwnership(newOwner);
        _grantRole(DEFAULT_ADMIN_ROLE, newOwner);
    }

    // @notice Fund the contract
    receive() external payable onlyOwner {
        emit ReserveFunded(msg.value);
    }

    /// @notice Set minimum staking for note creation
    function setMinimumStakePerNote(uint64 _miniumStakePerNote) external onlyOwner {
        minimumStakePerNote = _miniumStakePerNote;
        emit MinimumStakePerNoteUpdated(minimumStakePerNote);
    }

    /// @notice Set minimum staking for note rating
    function setMinimumStakePerRating(uint64 _minimumStakePerRating) external onlyOwner {
        minimumStakePerRating = _minimumStakePerRating;
        emit MinimumStakePerRatingUpdated(minimumStakePerRating);
    }

    ////////////////////////////////////////////////////////////////////////
    /// Finaliser actions
    ////////////////////////////////////////////////////////////////////////

    /// @notice Finalise a note
    function finaliseNote(string memory _postUrl, address _creator, uint8 _finalRating) external onlyRole(FINALISER_ROLE) {
        if (!isRatingValid(_finalRating)) revert RatingInvalid();
        if (!noteExists(_postUrl, _creator)) revert NoteDoesNotExist();
        if (isNoteFinalised(_postUrl, _creator)) revert NoteAlreadyFinalised();

        communityNotes[_postUrl][_creator].finalRating = _finalRating;
        rewardOrSlashCreator(_postUrl, _creator);
        rewardOrSlashRaters(_postUrl, _creator);
        emit NoteFinalised({postUrl: _postUrl, creator: _creator, finalRating: _finalRating});
    }
}
