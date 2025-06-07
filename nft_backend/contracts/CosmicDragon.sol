// file: contracts/CosmicDragon.sol (VERSI FINAL)
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CosmicDragon is ERC721, ERC721Enumerable, Ownable {
    uint256 public constant MAX_SUPPLY = 1000;
    uint256 public constant MINT_PRICE = 0.001 ether;

    string private constant METADATA_CID = "ipfs://bafkreiajazye72kme5hnh43xaa2yjx2qahi2zxmpyyadkcuepov7ovvhsi";

    constructor() ERC721("Cosmic Dragon", "CSD") Ownable(msg.sender) {}

    function safeMint() public payable {
        uint256 currentSupply = totalSupply();
        require(currentSupply < MAX_SUPPLY, "Max supply exceeded");
        require(msg.value == MINT_PRICE, "Incorrect mint value sent");
        _safeMint(msg.sender, currentSupply);
    }

    function tokenURI(uint256) public pure override returns (string memory) {
        return METADATA_CID;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) { return super._update(to, tokenId, auth); }
    function _increaseBalance(address account, uint128 value) internal override(ERC721, ERC721Enumerable) { super._increaseBalance(account, value); }
    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) { return super.supportsInterface(interfaceId); }
}