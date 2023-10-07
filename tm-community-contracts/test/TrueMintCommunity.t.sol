// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/TrueMintCommunity.sol";

contract TrueMintCommunityTest is Test, ITrueMintCommunity {
    TrueMintCommunity public tmCommunity;
    address public owner = address(1);
    address public notStaker = address(2);
    address public staker1 = address(3);
    address public staker2 = address(4);

    function stake(address staker) public {
        vm.expectEmit();
        emit UserHasStaked(staker, 1);
        hoax(staker);
        (bool result,) = payable(tmCommunity).call{value: 1}("");
        assertTrue(result);
    }

    function setUp() public {
        tmCommunity = new TrueMintCommunity({_owner: owner});
        stake(staker1);
        stake(staker2);
    }

    function test_submitNote_RevertIf_userNotStaker() public {
        vm.startPrank(notStaker);

        vm.expectRevert(ITrueMintCommunity.UserHasNoStake.selector);
        tmCommunity.submitNote({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });
    }

    function test_submitNote_RevertIf_postUrlInvalid() public {
        vm.startPrank(staker1);

        vm.expectRevert(ITrueMintCommunity.PostUrlInvalid.selector);
        tmCommunity.submitNote({
            _postUrl: "",
            _content: "Something something something"
        });

        vm.expectRevert(ITrueMintCommunity.PostUrlInvalid.selector);
        tmCommunity.submitNote({
            _postUrl: "https://twitter.com/something-something-something-something-something-something-something-something-something-something-something-something-something-something-something",
            _content: "Something something something"
        });
    }

    function test_submitNote_RevertIf_contentInvalid() public {
        vm.startPrank(staker1);

        vm.expectRevert(ITrueMintCommunity.ContentInvalid.selector);
        tmCommunity.submitNote({
            _postUrl: "https://twitter.com/something",
            _content: ""
        });

        vm.expectRevert(ITrueMintCommunity.ContentInvalid.selector);
        tmCommunity.submitNote({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something"
        });
    }

    function test_submitNote() public {
        vm.expectEmit();
        emit NoteCreated("https://twitter.com/something", staker1);
        vm.prank(staker1);
        tmCommunity.submitNote({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.expectEmit();
        emit NoteCreated("https://twitter.com/something", staker2);
        vm.prank(staker2);
        tmCommunity.submitNote({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });
    }

    function test_submitNote_RevertIf_alreadyExists() public {
        vm.startPrank(staker1);

        tmCommunity.submitNote({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.expectRevert(ITrueMintCommunity.NoteAlreadyExists.selector);
        tmCommunity.submitNote({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });
    }
}
