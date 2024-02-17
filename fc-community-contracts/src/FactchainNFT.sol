//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC721URIStorageUpgradeable} from
    "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import {ERC721Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

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
contract FactchainNFT is OwnableUpgradeable, ERC721URIStorageUpgradeable, UUPSUpgradeable, IFactchainSFTEvents {
    FactchainSFT factsLithography;
    uint256 public tokenIdCounter;
    string private baseTokenURI;
    mapping(string => mapping(address => uint256)) public noteIds;

    // disable contract until initialization
    constructor() {
        _disableInitializers();
    }

    function initialize(address _owner, address _factsLitography, string memory _baseTokenURI) public initializer {
        __ERC721_init("FactchainNotes", "FCN");
        __ERC721URIStorage_init();
        __Ownable_init(_owner);
        __UUPSUpgradeable_init();

        tokenIdCounter = 0;
        baseTokenURI = _baseTokenURI;
        factsLithography = FactchainSFT(_factsLitography);
    }

    function _authorizeUpgrade(address /* newImplementation */ ) internal view override onlyOwner {}

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
}
