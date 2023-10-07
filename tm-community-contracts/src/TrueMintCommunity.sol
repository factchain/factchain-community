//SPDX-License-Identifier: Unlicense
pragma solidity >=0.8.19;

import "./utils/Ownable.sol";

interface ITrueMintCommunityEvents {
    /// @dev This emits when a new Note is created
    event NoteCreated(bytes indexed postUrl, address indexed creator);
}

interface ITrueMintCommunity is ITrueMintCommunityEvents {
    /// @notice Note structure
    /// @param postUrl URL of the post targeted by this Note
    /// @param content Content of the Note
    /// @param creator Address of the Note's creator
    /// @param finalRating Final rating attributed by TrueMint
    struct Note {
        bytes postUrl;
        bytes content;
        address creator;
        int8 finalRating;
    }

    /// Errors
    error UserHasNoStake();
    error PostUrlTooLong();
    error ContentTooLong();
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
    mapping(address => uint32) public stakedBalances;

    /// @notice Map of community notes
    mapping(bytes => Note) public communityNotes;

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
        if (_postUrl.length == 0 || _postUrl.length > POST_URL_MAX_LENGTH) revert PostUrlTooLong();
    }

    function validateContent(bytes memory _content) internal pure {
        if (_content.length == 0 || _content.length > CONTENT_MAX_LENGTH) revert ContentTooLong();
    }

    ////////////////////////////////////////////////////////////////////////
    /// User actions
    ////////////////////////////////////////////////////////////////////////

    /// @notice Create a new note
    function submitNote(bytes memory _postUrl, bytes memory _content) external onlyStaker {
        validatePostUrl(_postUrl);
        validateContent(_content);

        // TODO noteId should be the concatenation of _postUrl and msg.sender
        if (communityNotes[_postUrl].postUrl.length <= 0) revert NoteAlreadyExists();
        communityNotes[_postUrl] = Note({
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
