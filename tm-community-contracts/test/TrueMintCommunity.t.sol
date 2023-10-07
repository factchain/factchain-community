// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/TrueMintCommunity.sol";

contract TrueMintCommunityTest is Test, ITrueMintCommunity {
    TrueMintCommunity public tmCommunity;
    address public owner = address(1);
    address public notStaker = address(2);

    function setUp() public {
        tmCommunity = new TrueMintCommunity({_owner: owner});
    }

    function test_submitNote() public {
        vm.startPrank(notStaker);

        vm.expectRevert(ITrueMintCommunity.UserHasNoStake.selector);
        tmCommunity.submitNote({
            _postUrl: bytes("https://twitter.com/something"),
            _content: bytes("Something something something")
        });
    }
}