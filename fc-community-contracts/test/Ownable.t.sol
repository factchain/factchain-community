// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/utils/Ownable.sol";

contract OwnableTest is Test, IOwnableEvents {
    Ownable public ownable;
    address public owner = address(1);

    function setUp() public {
        vm.expectEmit();
        emit OwnershipTransferred({
            previousOwner: address(0),
            newOwner: owner
        });

        ownable = new Ownable(owner);
    }

    function test_supportsERC173Interface() public {
        assertTrue(ownable.supportsInterface(0x7f5828d0));
        assertFalse(ownable.supportsInterface(0xffffffff));
    }

    function test_transferOwnership() public {
        address newOwner = address(2);

        vm.expectEmit();
        emit OwnershipTransferred({
            previousOwner: owner,
            newOwner: newOwner
        });
        vm.prank(owner);
        ownable.transferOwnership(newOwner);
        assertEq(ownable.owner(), newOwner);

        vm.expectEmit();
        emit OwnershipTransferred({
            previousOwner: newOwner,
            newOwner: owner
        });
        vm.prank(newOwner);
        ownable.transferOwnership(owner);
        assertEq(ownable.owner(), owner);
    }

    function test_transferOwnership_RevertIf_notOwner() public {
        address notOwner = address(2);
        vm.startPrank(notOwner);

        vm.expectRevert(IOwnable.NotOwner.selector);
        ownable.transferOwnership(notOwner);
    }
}