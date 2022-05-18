// SPDX-License-Identifier: Apache-2.0 and MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @title Legal Agreement Non-fingible Token
 */
contract Agreement is ERC721Enumerable {
    string public baseURI;

    mapping (uint256 => uint256) private _tokenTSs;
    mapping (uint256 => string) private _tokenCIDs;

    constructor() ERC721("LegalNFT Agreement", "LGLN") {
        baseURI = "https://ipfs.io/ipfs/";
    }

    function tokenTS(uint256 tokenID) external view returns (uint256) { return(_tokenTSs[tokenID]); }

    function toTokenID(address owner, string memory CID) public pure returns (uint256) { 
        return(uint256(keccak256(abi.encodePacked(owner, CID)))); 
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseURI, _tokenCIDs[tokenId]));
    }

    function mint(address to, string memory CID) external returns (uint256 tokenId) {
        tokenId = toTokenID(to, CID);
        _mint(to, tokenId);
        _tokenTSs[tokenId] = block.timestamp;
        _tokenCIDs[tokenId] = CID;
    }

    function safeMint(address to, string memory CID) external returns (uint256 tokenId) {
        tokenId = toTokenID(to, CID);
        _safeMint(to, tokenId);
        _tokenTSs[tokenId] = block.timestamp;
        _tokenCIDs[tokenId] = CID;
    }
}
