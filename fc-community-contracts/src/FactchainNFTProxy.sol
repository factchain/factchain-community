//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {FactchainNFT} from "./FactchainNFT.sol";

contract FactchainNFTProxy is ERC1967Proxy {
    FactchainNFT collection = new FactchainNFT();

    constructor(address _owner, address _factsLitography, string memory _baseTokenURI)
        ERC1967Proxy(address(collection), abi.encodeCall(collection.initialize, (_owner, _factsLitography, _baseTokenURI)))
    {}
}
