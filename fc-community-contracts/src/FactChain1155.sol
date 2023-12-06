//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import {ECDSA} from "openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import {MessageHashUtils} from "openzeppelin-contracts/contracts/utils/cryptography/MessageHashUtils.sol";

import {Strings} from "openzeppelin-contracts/contracts/utils/Strings.sol";

import {Ownable} from "./utils/Ownable.sol";

interface IFactChain1155Events {
    // Events
    event NewToken(uint256 tokenId, uint256 tokenSupply);
    event MintWithProvidedValue(uint256 tokenId, uint256 value);
    event MintWithAdjustedValue(uint256 tokenId, uint256 value);
    event NewBackend(address backend);
    event Refunded(address sender, uint256 amount);
}

interface IFactChain1155 is IFactChain1155Events {
    // Errors
    error SupplyExhausted();
    error ValueError();
    error NoTokenAssociated();
    error BadMintPrice();
    error UnknownToken();
    error NotAllowed();
}

/// @title X Community Note NFTs
/// @author Pierre HAY
/// @notice
/// @dev
contract FactChain1155 is Ownable, ERC1155, IFactChain1155 {
    using ECDSA for bytes32;

    uint256 public constant MAX_TOKEN_SUPPLY = 42;
    uint256 public constant MINT_PRICE = 1_000_000;
    uint256 public constant SUPPLY_EXHAUSTED = MAX_TOKEN_SUPPLY + 1;

    address public backend;
    mapping(uint256 id => uint256) public supply;

    constructor(address _owner, address _backend)
        Ownable(_owner)
        ERC1155("https://factchain-community.s3.eu-west-3.amazonaws.com/{id}.json")
    {
        backend = _backend;
        emit NewBackend(backend);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function setBackend(address _backend) public onlyOwner {
        backend = _backend;
        emit NewBackend(backend);
    }

    function getTokenID(string memory url) public view returns (uint256) {
        // the token ID is a 9 to 10 digits number calculated from
        // the url hash by converting to decimal its first 8 hex characters.
        bytes32 hash = keccak256(abi.encodePacked(url));
        // shift 224 bits to the right
        // effectively taking the first (256 - 224) 32 bits (8 hex characters) of the hash.
        uint256 tokenId = uint256(hash) >> 224;
        if (supply[tokenId] == 0) revert NoTokenAssociated();
        return tokenId;
    }

    function mint(uint256 id, uint256 value) public payable {
        if (value <= 0) revert ValueError();
        if (msg.value != MINT_PRICE * value) revert BadMintPrice();
        if (supply[id] == SUPPLY_EXHAUSTED) revert SupplyExhausted();
        if (supply[id] == 0) revert UnknownToken();
        if (value > supply[id]) {
            emit MintWithAdjustedValue(id, supply[id]);
            _mint(msg.sender, id, supply[id], "");
            // using transfer because it only provides 2300 gas
            // protecting the contract from re-entry attacks.
            uint256 amount = (value - supply[id]) * MINT_PRICE;
            payable(msg.sender).transfer(amount);
            emit Refunded(msg.sender, amount);
            supply[id] = SUPPLY_EXHAUSTED;
        } else {
            emit MintWithProvidedValue(id, value);
            _mint(msg.sender, id, value, "");
            supply[id] == value ? supply[id] = SUPPLY_EXHAUSTED : supply[id] -= value;
        }
    }

    function mint(uint256 id, uint256 value, bytes32 _hash, bytes memory signature) external payable {
        if (supply[id] == 0) {
            verifyHash(Strings.toString(id), _hash);
            verifySignature(_hash, signature);
            supply[id] = worstRandEver();
            emit NewToken(id, supply[id]);
        }
        mint(id, value);
    }

    function verifyHash(string memory id, bytes32 _hash) public pure {
        if (_hash != keccak256(abi.encodePacked(id))) revert ValueError();
    }

    function verifySignature(bytes32 _hash, bytes memory signature) public view {
        bytes32 eip191 = MessageHashUtils.toEthSignedMessageHash(_hash);
        address recoveredSigner = eip191.recover(signature);
        if (recoveredSigner != backend) revert NotAllowed();
    }

    function worstRandEver() internal view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % MAX_TOKEN_SUPPLY;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Ownable) returns (bool) {
        // https://docs.soliditylang.org/en/develop/contracts.html#multiple-inheritance-and-linearization
        // Solidity uses C3 linearization (like Python) but MRO is from right to left (unlike Python)
        // We rewrite the Ownbale supportInterface check first to have it included in the call chain.
        return interfaceId == 0x7f5828d0 || super.supportsInterface(interfaceId);
    }

    // function setTokenSupply(uint256 id, uint256 _supply) public onlyOwner {
    //     // Since the supply is random for any token, `setTokenSupply`
    //     // is useful for testing but obviously not acceptable in production.
    //     // Uncomment the following function to activate following tests
    //     // testMintWithAdjustedValue, testMintWithProvidedValue from test/FactChain1155.sol
    //     supply[id] = _supply;
    // }
}
