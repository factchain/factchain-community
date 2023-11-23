//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "./utils/Ownable.sol";

/// @title X Community Note NFTs
/// @author Pierre HAY
/// @notice
/// @dev
contract FactChain1155 is Ownable, ERC1155 {
    uint256 public tokenIdCounter;

    constructor(address _owner)
        Ownable(_owner)
        ERC1155("https://factchain-community.s3.eu-west-3.amazonaws.com/{id}.json") {}


    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function getTokenID(string memory url) public pure returns (uint256) {
        bytes32 hash = keccak256(abi.encodePacked(url));
        // slicedValue >> 224 is used to shift the bits to the right
        // effectively taking the first 32 bits (8 hex characters) of the hash.
        uint256 result = uint256(hash) >> 224;
        return result;
    }



    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, Ownable)
        returns (bool)
    {
        // https://docs.soliditylang.org/en/develop/contracts.html#multiple-inheritance-and-linearization
        // Solidity uses C3 linearization (like Python) but MRO is from right to left (unlike Python)
        // We rewrite the Ownbale supportInterface check first to have it included in the call chain.
        return interfaceId == 0x7f5828d0 || super.supportsInterface(interfaceId);
    }
}