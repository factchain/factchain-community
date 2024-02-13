//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.20;

import {ERC1155URIStorage} from "openzeppelin-contracts/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import {ERC1155} from "openzeppelin-contracts/contracts/token/ERC1155/ERC1155.sol";
import {Ownable} from "./utils/Ownable.sol";

import {Arrays} from "openzeppelin-contracts/contracts/utils/Arrays.sol";

interface IFactchainSFTEvents {
    event FactchainNFTContractUpdated(address factchainNFTContract);
    event FactchainBuildersRewarded(uint256 amount);
    event CreatorRewarded(address creator, uint256 amount);
}

interface IFactchainSFT is IFactchainSFTEvents {
    // Errors
    error SupplyExhausted();
    error ValueError();
    error BadMintPrice();
    error NegativeBalance();
    error FailedToReward();
    error ReservedToFactchain();
}

contract FactchainSFT is Ownable, ERC1155URIStorage, IFactchainSFT {
    address public FACTCHAIN_NFT_CONTRACT;
    uint256 public constant FACTCHAINERS_MINT_SUPPLY = 42;
    uint256 public mintPrice = 1_000_000_000_000_000;

    mapping(uint256 => uint256) public supply;

    /// @notice Mapping of creators's addresses to NFT
    mapping(uint256 => address) private _creatorsNFT;

    using Arrays for address[];

    constructor(address _owner) Ownable(_owner) ERC1155("https://gateway.pinata.cloud/ipfs/") {
        _setBaseURI("https://gateway.pinata.cloud/ipfs/");
    }

    function setFactchainNFTContract(address _factchainNFTContract) public onlyOwner {
        FACTCHAIN_NFT_CONTRACT = _factchainNFTContract;
        emit FactchainNFTContractUpdated(_factchainNFTContract);
    }

    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function initialMint(address creator, address[] memory raters, string memory ipfsHash, uint256 id)
        public
        returns (uint256)
    {
        if (msg.sender != FACTCHAIN_NFT_CONTRACT) {
            revert ReservedToFactchain();
        }
        supply[id] = FACTCHAINERS_MINT_SUPPLY;
        _creatorsNFT[id] = creator;
        _setURI(id, ipfsHash);
        for (uint256 i = 0; i < raters.length; ++i) {
            _mint(raters.unsafeMemoryAccess(i), id, 1, "");
        }
        return id;
    }

    function mint(uint256 id, uint256 value) external payable {
        if (msg.value != mintPrice * value) revert BadMintPrice();
        if (value <= 0) revert ValueError();
        if (value > supply[id]) {
            revert SupplyExhausted();
        }
        supply[id] -= value;
        address creator = _creatorsNFT[id];
        uint256 reward = msg.value / 2;
        (bool result,) = payable(creator).call{value: reward}("");
        if (!result) revert FailedToReward();
        emit FactchainBuildersRewarded(reward);
        emit CreatorRewarded(creator, reward);
        _mint(msg.sender, id, value, "");
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC1155, Ownable) returns (bool) {
        // https://docs.soliditylang.org/en/develop/contracts.html#multiple-inheritance-and-linearization
        // Solidity uses C3 linearization (like Python) but MRO is from right to left (unlike Python)
        // We rewrite the Ownbale supportInterface check first to have it included in the call chain.
        return interfaceId == 0x7f5828d0 || super.supportsInterface(interfaceId);
    }
}
