//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.19;

import "./utils/Ownable.sol";

interface ITrueMintCommunityEvents {
    /// @dev This emits when a User stakes funds into the contract
    event UserHasStaked(address indexed staker, uint256 amount);
    /// @dev This emits when a new Note is created
    event NoteCreated(string indexed postUrl, address indexed creator);
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
        int8 finalRating;
    }

    /// Errors
    error UserHasNoStake();
    error PostUrlInvalid();
    error ContentInvalid();
    error NoteAlreadyExists();
    error FinalRatingInvalid();
}

/// @title TrueMint Community
/// @author Yacine B. Badiss
/// @notice 
/// @dev 
contract TrueMintCommunity is Ownable, ITrueMintCommunity {
    address internal constant SLASH_POOL = 0x0000000000000000000000000000000000000000;
    uint8 internal constant POST_URL_MAX_LENGTH = 160;
    uint16 internal constant CONTENT_MAX_LENGTH = 500;

    /// @notice Tracks balances staked by each user
    mapping(address => uint256) public stakedBalances;

    /// @notice Map of community notes
    mapping(string => mapping(address => Note)) public communityNotes;

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

    function validatePostUrl(bytes memory _postUrl) internal pure {
        if (_postUrl.length == 0 || _postUrl.length > POST_URL_MAX_LENGTH) revert PostUrlInvalid();
    }

    function validateContent(bytes memory _content) internal pure {
        if (_content.length == 0 || _content.length > CONTENT_MAX_LENGTH) revert ContentInvalid();
    }

    function noteExists(string memory postUrl, address creator) internal view returns (bool) {
        return bytes(communityNotes[postUrl][creator].postUrl).length > 0;
    }

    ////////////////////////////////////////////////////////////////////////
    /// User actions
    ////////////////////////////////////////////////////////////////////////

    receive() external payable {
        stakedBalances[msg.sender] += msg.value;
        emit UserHasStaked(msg.sender, msg.value);
    }

    /// @notice Create a new note
    function submitNote(string memory _postUrl, string memory _content) external onlyStaker {
        validatePostUrl(bytes(_postUrl));
        validateContent(bytes(_content));

        if (noteExists(_postUrl, msg.sender)) revert NoteAlreadyExists();
        communityNotes[_postUrl][msg.sender] = Note({
            postUrl: _postUrl,
            content: _content,
            creator: msg.sender,
            finalRating: -1
        });
        emit NoteCreated({
            postUrl: _postUrl,
            creator: msg.sender
        });
    }
}
