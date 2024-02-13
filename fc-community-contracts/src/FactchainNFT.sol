//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "./utils/Ownable.sol";

contract FactchainSFT {
    function initialMint(address creator, address[] memory raters, string memory ipfsHash, uint256 id)
        public
        returns (uint256)
    {}
}

interface IFactchainSFTEvents {
    event FactchainSFTContractUpdated(address factsLithography);
}

/// @title Factchainers Community Notes NFT
/// @author Pierre HAY
/// @notice
/// @dev
contract FactchainNFT is Ownable, ERC721URIStorage, IFactchainSFTEvents {
    FactchainSFT factsLithography;
    uint256 public tokenIdCounter;
    string private baseTokenURI;
    mapping(string => mapping(address => uint256)) public noteIds;

    constructor(address _owner, address _factsLitography, string memory _baseTokenURI)
        Ownable(_owner)
        ERC721("FactchainNotes", "FCN")
    {
        tokenIdCounter = 0;
        baseTokenURI = _baseTokenURI;
        factsLithography = FactchainSFT(_factsLitography);
    }

    function setFactchainSFTContract(address _factsLitography) public onlyOwner {
        factsLithography = FactchainSFT(_factsLitography);
        emit FactchainSFTContractUpdated(_factsLitography);
    }

    /// @notice mint a NFT
    /// @param creator destination address for the orginal fact (NFT-721)
    /// @param raters raters's addresses to receive a copy of the original (SFT-1155)
    /// @param ipfsHash metadata ID on ipfs shared by the original and its copies
    function mint(address creator, string memory postUrl, address[] memory raters, string memory ipfsHash)
        public
        onlyOwner
        returns (uint256)
    {
        unchecked {
            // An overflow here would be a great collective achievement (2**256 factchain notes)
            ++tokenIdCounter;
        }
        uint256 newItemId = tokenIdCounter;
        _safeMint(creator, newItemId);
        _setTokenURI(newItemId, ipfsHash);
        factsLithography.initialMint(creator, raters, ipfsHash, newItemId);
        noteIds[postUrl][creator] = newItemId;
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
        // We rewrite the Ownbale supportInterface check first to have it included in the call chain.
        return interfaceId == 0x7f5828d0 || super.supportsInterface(interfaceId);
    }
}
