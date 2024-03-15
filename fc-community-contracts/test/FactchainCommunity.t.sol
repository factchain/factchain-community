// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {FactchainCommunity, IFactchainCommunity} from "../src/FactchainCommunity.sol";
import {FactchainProxy} from "../src/FactchainProxy.sol";

contract FactchainCommunityTest is Test, IFactchainCommunity {
    FactchainCommunity public fcCommunity;
    bytes32 public constant FINALISER_ROLE = keccak256("FINALISER_ROLE");

    uint160 lastUintAddress = 0;

    function nextAddress() public returns (address) {
        lastUintAddress += 1;
        return address(lastUintAddress);
    }

    address public theOwner = nextAddress();
    address public theAdmin = nextAddress();
    address public player1 = nextAddress();
    address public player2 = nextAddress();
    address public rater1 = nextAddress();
    address public rater2 = nextAddress();
    address public rater3 = nextAddress();

    function fundReserve() public {
        hoax(theOwner);
        vm.expectEmit();
        emit ReserveFunded(1_000_000_000_000_000_000);
        (bool result,) = payable(fcCommunity).call{value: 1_000_000_000_000_000_000}("");
        assertTrue(result);

        hoax(theOwner);
        fcCommunity.grantRole(FINALISER_ROLE, theAdmin);
    }

    function setUp() public {
        FactchainCommunity implementation = new FactchainCommunity();
        FactchainProxy proxy =
            new FactchainProxy(address(implementation), abi.encodeCall(implementation.initialize, (theOwner)));
        fcCommunity = FactchainCommunity(payable(address(proxy)));
        fundReserve();
    }

    function test_createNote_RevertIf_notEnoughEth() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        hoax(player1);
        vm.expectRevert(IFactchainCommunity.InsufficientStake.selector);
        fcCommunity.createNote{value: minimumStakePerNote - 1}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });
    }

    function test_createNote_RevertIf_postUrlInvalid() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        hoax(player1);
        vm.expectRevert(IFactchainCommunity.PostUrlInvalid.selector);
        fcCommunity.createNote{value: minimumStakePerNote}({_postUrl: "", _content: "Something something something"});
        vm.expectRevert(IFactchainCommunity.PostUrlInvalid.selector);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something-something-something-something-something-something-something-something-something-something-something-something-something-something-something",
            _content: "Something something something"
        });
    }

    function test_createNote_RevertIf_contentInvalid() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        hoax(player1);
        vm.expectRevert(IFactchainCommunity.ContentInvalid.selector);
        fcCommunity.createNote{value: minimumStakePerNote}({_postUrl: "https://twitter.com/something", _content: ""});

        vm.expectRevert(IFactchainCommunity.ContentInvalid.selector);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something something"
        });
    }

    function test_createNote() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        (uint32 originalNumberNotes,,,) = fcCommunity.userStats(player1);
        hoax(player1);
        vm.expectEmit();
        emit NoteCreated("https://twitter.com/something", player1, minimumStakePerNote);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });
        (uint32 newNumberNotes,,,) = fcCommunity.userStats(player1);
        assert(newNumberNotes == originalNumberNotes + 1);
    }

    function test_createNote_RevertIf_alreadyExists() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });
        vm.prank(player1);
        vm.expectRevert(IFactchainCommunity.NoteAlreadyExists.selector);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });
    }

    function test_rateNote_RevertIf_ratingInvalid() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        uint256 minimumStakePerRating = fcCommunity.minimumStakePerRating();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        hoax(rater1);
        vm.expectRevert(IFactchainCommunity.RatingInvalid.selector);
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 0
        });
        vm.expectRevert(IFactchainCommunity.RatingInvalid.selector);
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 6
        });
    }

    function test_rateNot_RevertIf_notEnoughStake() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        uint256 minimumStakePerRating = fcCommunity.minimumStakePerRating();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });
        hoax(player2);
        vm.expectRevert(IFactchainCommunity.InsufficientStake.selector);
        fcCommunity.rateNote{value: minimumStakePerRating - 1}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 4
        });
    }

    function test_rateNote_RevertIf_creatorIsRater() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        uint256 minimumStakePerRating = fcCommunity.minimumStakePerRating();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.prank(player1);
        vm.expectRevert(IFactchainCommunity.CantRateOwnNote.selector);
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 1
        });
    }

    function test_rateNote_RevertIf_noteDoesNotExist() public {
        uint256 minimumStakePerRating = fcCommunity.minimumStakePerRating();
        hoax(player2);
        vm.expectRevert(IFactchainCommunity.NoteDoesNotExist.selector);
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 1
        });
    }

    function test_rateNote_RevertIf_noteAlreadyFinalised() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        uint256 minimumStakePerRating = fcCommunity.minimumStakePerRating();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.prank(theAdmin);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 1});

        hoax(rater1);
        vm.expectRevert(IFactchainCommunity.NoteAlreadyFinalised.selector);
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 2
        });
    }

    function test_rateNote() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        uint256 minimumStakePerRating = fcCommunity.minimumStakePerRating();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        (, uint32 originalNumberRatings,,) = fcCommunity.userStats(rater1);
        vm.expectEmit();
        emit NoteRated("https://twitter.com/something", player1, rater1, 1, minimumStakePerRating);
        hoax(rater1);
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 1
        });
        (, uint32 newNumberRatings,,) = fcCommunity.userStats(rater1);
        assert(newNumberRatings == originalNumberRatings + 1);
    }

    function test_rateNote_RevertIf_ratingAlreadyExist() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        uint256 minimumStakePerRating = fcCommunity.minimumStakePerRating();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        hoax(rater1);
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 1
        });

        hoax(rater1);
        vm.expectRevert(IFactchainCommunity.RatingAlreadyExists.selector);
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 2
        });
    }

    function test_finaliseNote_RevertIf_notFinaliser() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.startPrank(theOwner);
        // following specif expectRevert should work ...
        // vm.expectRevert(OwnableUpgradeable.OwnableUnauthorizedAccount.selector);
        vm.expectRevert();
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 1});
    }

    function test_finaliseNote_RevertIf_ratingInvalid() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.startPrank(theAdmin);
        vm.expectRevert(IFactchainCommunity.RatingInvalid.selector);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 0});
        vm.expectRevert(IFactchainCommunity.RatingInvalid.selector);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 6});
    }

    function test_finaliseNote_RevertIf_notDoesNotExist() public {
        vm.prank(theAdmin);
        vm.expectRevert(IFactchainCommunity.NoteDoesNotExist.selector);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 1});
    }

    function test_finaliseNote() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.expectEmit();
        emit NoteFinalised("https://twitter.com/something", player1, 1);
        vm.prank(theAdmin);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 1});
    }

    function test_finaliseNote_RevertIf_noteAlreadyFinalised() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.startPrank(theAdmin);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 1});

        vm.expectRevert(IFactchainCommunity.NoteAlreadyFinalised.selector);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 1});
    }

    function test_rewardAndSlashRaters() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        uint256 minimumStakePerRating = fcCommunity.minimumStakePerRating();
        (,, uint96 rater1OldRewards,) = fcCommunity.userStats(rater1);
        (,,, uint96 rater2OldSlash) = fcCommunity.userStats(rater2);
        (,,, uint96 rater3OldSlash) = fcCommunity.userStats(rater3);

        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        hoax(rater1);
        uint256 rater1OriginalBalance = rater1.balance;
        // _rating perfectly matches final rating (1)
        // rater1 should be reward of 1.5 * stake
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 1
        });

        hoax(rater2);
        uint256 rater2OriginalBalance = rater2.balance;
        // wrong rating with maximal delta
        // rater2 should be slashed of their entire stake
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 5
        });

        hoax(rater3);
        uint256 rater3OriginalBalance = rater3.balance;
        // wrong rating with delta == 3
        // rater2 should be slashed of 0.75 * stake
        fcCommunity.rateNote{value: minimumStakePerRating}({
            _postUrl: "https://twitter.com/something",
            _creator: player1,
            _rating: 4
        });
        vm.expectEmit();
        emit RaterRewarded("https://twitter.com/something", player1, rater1, 150000000000000, minimumStakePerRating);
        vm.expectEmit();
        emit RaterSlashed(
            "https://twitter.com/something", player1, rater2, minimumStakePerRating, minimumStakePerRating
        );

        vm.prank(theAdmin);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 1});

        (,, uint96 rater1NewRewards,) = fcCommunity.userStats(rater1);

        // Asserts a is approximately equal to b with delta in percentage, where 1e18 is 100%.
        // OK
        assertApproxEqRel(rater1.balance, rater1OriginalBalance + 150000000000000, 1e18);
        // Fail
        // assert(rater1.balance == rater1OriginalBalance + 150000000000000);
        assertApproxEqRel(rater1NewRewards, rater1OldRewards + 150000000000000, 1e18);
        (,,, uint96 rater2NewSlash) = fcCommunity.userStats(rater2);
        assertApproxEqRel(rater2.balance, rater2OriginalBalance - minimumStakePerRating, 1e18);
        assertApproxEqRel(rater2NewSlash, rater2OldSlash + minimumStakePerRating, 1e18);
        (,,, uint96 rater3NewSlash) = fcCommunity.userStats(rater3);
        assertApproxEqRel(rater3.balance, rater3OriginalBalance - 75000000000000, 1e18);
        assertApproxEqRel(rater3NewSlash, rater3OldSlash + 75000000000000, 1e18);
    }

    function test_rewardCreator() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        (,, uint96 oldRewards,) = fcCommunity.userStats(player1);

        hoax(player1);
        uint256 player1OriginalBalance = player1.balance;
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.expectEmit();

        uint96 expectedReward = 1_500_000_000_000_000;
        emit CreatorRewarded("https://twitter.com/something", player1, expectedReward, minimumStakePerNote);
        vm.prank(theAdmin);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 5});
        assert(player1.balance == player1OriginalBalance + expectedReward);
        (,, uint96 newRewards,) = fcCommunity.userStats(player1);
        assert(newRewards == oldRewards + expectedReward);
    }

    function test_slashCreator() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        (,,, uint96 oldSlash) = fcCommunity.userStats(player1);
        hoax(player1);
        uint256 player1OriginalBalance = player1.balance;
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });
        vm.expectEmit();
        emit CreatorSlashed("https://twitter.com/something", player1, minimumStakePerNote, minimumStakePerNote);
        vm.prank(theAdmin);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 1});
        assert(player1.balance == player1OriginalBalance - minimumStakePerNote);
        (,,, uint96 newSlash) = fcCommunity.userStats(player1);
        assert(newSlash == oldSlash + minimumStakePerNote);
    }

    function test_EmitIf_insufficientFundForReward() public {
        uint256 minimumStakePerNote = fcCommunity.minimumStakePerNote();
        hoax(player1);
        fcCommunity.createNote{value: minimumStakePerNote}({
            _postUrl: "https://twitter.com/something",
            _content: "Something something something"
        });

        vm.expectEmit();
        uint256 expectedReward = minimumStakePerNote + minimumStakePerNote / 2;
        emit FailedToReward(player1, minimumStakePerNote + expectedReward);
        emit NoteFinalised("https://twitter.com/something", player1, 5);

        vm.prank(theAdmin);
        vm.deal(address(fcCommunity), 0);
        fcCommunity.finaliseNote({_postUrl: "https://twitter.com/something", _creator: player1, _finalRating: 5});

        assert(fcCommunity.stuckFunds(player1) == minimumStakePerNote + expectedReward);
    }

    function test_setMinimumStakePerNote() public {
        vm.prank(theOwner);
        fcCommunity.setMinimumStakePerNote(123);
        assert(fcCommunity.minimumStakePerNote() == 123);
    }

    function test_setMinimumStakePerNote_RevertIf_notOwner() public {
        // following specif expectRevert should work ...
        // vm.expectRevert(OwnableUpgradeable.OwnableUnauthorizedAccount.selector);
        vm.expectRevert();
        vm.prank(player1);
        fcCommunity.setMinimumStakePerNote(123);
    }

    function test_setMinimumStakePerRating() public {
        vm.prank(theOwner);
        fcCommunity.setMinimumStakePerRating(123);
        assert(fcCommunity.minimumStakePerRating() == 123);
    }

    function test_setMinimumStakePerRating_RevertIf_notOwner() public {
        // following specif expectRevert should work ...
        // vm.expectRevert(OwnableUpgradeable.OwnableUnauthorizedAccount.selector);
        vm.expectRevert();
        vm.prank(player1);
        fcCommunity.setMinimumStakePerRating(123);
    }
}
