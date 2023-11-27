//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "./utils/Ownable.sol";


interface IFactChain1155Events {
    // Events
    event NewToken(uint256 tokenId, uint256 tokenSupply);
    event MintWithProvidedValue(uint256 tokenId, uint256 value);
    event MintWithAdjustedValue(uint256 tokenId, uint256 value);
}

interface IFactChain1155 is IFactChain1155Events {
    // Errors
    error SupplyExhausted();
    error Greed();
    error NoTokenAssociated();
    error BadMintPrice();
}


/// @title X Community Note NFTs
/// @author Pierre HAY
/// @notice
/// @dev
contract FactChain1155 is Ownable, ERC1155, IFactChain1155 {
    uint256 public constant MAX_TOKEN_SUPPLY = 42;
    uint256 public constant MINT_PRICE = 1_000_000;
    uint256 public constant SUPPLY_EXHAUSTED = MAX_TOKEN_SUPPLY + 1;
    mapping(uint256 id => uint256) public supply;


    constructor(address _owner)
        Ownable(_owner)
        ERC1155("https://factchain-community.s3.eu-west-3.amazonaws.com/{id}.json")
    {}

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
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

    function mint(uint256 id, uint256 value) external payable {
        if (msg.value != MINT_PRICE) revert BadMintPrice();
        if (value > MAX_TOKEN_SUPPLY) revert Greed();
        if (supply[id] == SUPPLY_EXHAUSTED) revert SupplyExhausted();

        if (supply[id] == 0) {
            supply[id] = worstRandEver();
            emit NewToken(id, supply[id]);
        }
        if (value > supply[id]) {
            emit MintWithAdjustedValue(id, supply[id]);
            _mint(msg.sender, id, supply[id], "");
            supply[id] = SUPPLY_EXHAUSTED;
        } else {
            emit MintWithProvidedValue(id, value);
            _mint(msg.sender, id, value, "");
            supply[id] == value ? supply[id] = SUPPLY_EXHAUSTED : supply[id] -= value;
        }
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
