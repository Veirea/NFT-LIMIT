// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LimitedAccessImageNFT {
    address public owner;
    uint256 public nextTokenId = 1;

    struct NFTData {
        string imageURL;
        uint256 maxAccess;
        uint256 accessCount;
    }

    mapping(uint256 => NFTData) public nftData;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner");
        _;
    }

    /// @notice Mint ảnh mới với số lượt truy cập giới hạn
    function mint(string memory imageURL, uint256 maxAccess) public onlyOwner {
        uint256 tokenId = nextTokenId;
        nftData[tokenId] = NFTData({
            imageURL: imageURL,
            maxAccess: maxAccess,
            accessCount: 0
        });
        nextTokenId++;
    }

    /// @notice Xem ảnh nếu còn lượt
    function viewImage(uint256 tokenId) public returns (string memory) {
        require(tokenId > 0 && tokenId < nextTokenId, "Invalid tokenId");
        require(nftData[tokenId].accessCount < nftData[tokenId].maxAccess, "Access limit reached");

        nftData[tokenId].accessCount++;
        return nftData[tokenId].imageURL;
    }

    /// @notice Trả về số lượt còn lại
    function remainingAccess(uint256 tokenId) public view returns (uint256) {
        require(tokenId > 0 && tokenId < nextTokenId, "Invalid tokenId");
        return nftData[tokenId].maxAccess - nftData[tokenId].accessCount;
    }

    /// @notice Lấy tổng số NFT đã mint (dùng để frontend render danh sách)
    function getTotalMinted() public view returns (uint256) {
        return nextTokenId - 1;
    }
}
