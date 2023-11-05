//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "./ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "./ERC721/ERC721.sol";
import {Ownable} from "./utils/Ownable.sol";

/// @title FactChainers Community Notes NFT
/// @author Pierre HAY
/// @notice
/// @dev
contract FactChainNFT is Ownable, ERC721URIStorage {
    uint256 public tokenIdCounter;
    string private baseTokenURI;

    constructor(address _owner, string memory _name, string memory _symbol, string memory _baseTokenURI)
        Ownable(_owner)
        ERC721(_name, _symbol)
    {
        tokenIdCounter = 0;
        baseTokenURI = _baseTokenURI;
    }

    /// @notice mint a NFT
    /// @param recipient destination address
    function mint(address recipient, string memory ipfsHash) public onlyOwner returns (uint256) {
        // An overflow here would be a great achievement (2**256 factchain notes)
        unchecked {
            ++tokenIdCounter;
        }
        uint256 newItemId = tokenIdCounter;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, ipfsHash);
        return newItemId;
    }

    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    /// @notice set a new baseTokenURI
    /// @param _baseTokenURI the new base token URI
    function setBaseURI(string memory _baseTokenURI) public onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721URIStorage, Ownable)
        returns (bool)
    {
        // https://docs.soliditylang.org/en/develop/contracts.html#multiple-inheritance-and-linearization
        // Solidity uses C3 linearization (like Python) but MRO is from right to left (unlike Python)
        // We rewrite the Ownbale supportInterface check first to include it in the call chain.
        return interfaceId == 0x7f5828d0 || super.supportsInterface(interfaceId);
    }
}
