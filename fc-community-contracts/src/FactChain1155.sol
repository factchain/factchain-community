pragma solidity ^0.8.20;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "./utils/Ownable.sol";


contract FactChain1155 is Ownable, ERC1155 {

    constructor(address _owner, string memory _baseTokenURI)
        Ownable(_owner)
        ERC1155("FactchainNotes", "FCN")
    {
        tokenIdCounter = 0;
        baseTokenURI = _baseTokenURI;
    }
}