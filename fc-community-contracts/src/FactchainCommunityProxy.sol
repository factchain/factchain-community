//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {FactchainCommunity} from "./FactchainCommunity.sol";

contract FactchainCommunityProxy is ERC1967Proxy {
    FactchainCommunity fcCommunity = new FactchainCommunity();

    constructor(address initialOwner)
        ERC1967Proxy(address(fcCommunity), abi.encodeCall(fcCommunity.initialize, (initialOwner)))
    {}
}
