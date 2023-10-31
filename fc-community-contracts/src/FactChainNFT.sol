//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC721URIStorage} from "./ERC721/extensions/ERC721URIStorage.sol";

import {ERC721} from "./ERC721/ERC721.sol";

import {Ownable} from "./utils/Ownable.sol";

contract FactChainNFT is ERC721URIStorage, Ownable {

    uint256 private _tokenIdCounter;

    constructor(address _owner) ERC721("FactchainersNotes", "FCN") Ownable(_owner) {
        _tokenIdCounter = 0;
    }

    function _baseURI() internal pure override returns (string memory){
        return "https://gateway.pinata.cloud/ipfs/";
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721URIStorage, Ownable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}