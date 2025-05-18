// import { useState } from "react";
// import { ethers } from "ethers";
// import abi from "./abi.json";

// const contractAddress = "0x38fe239466179aFAf2a4C2330154Dbdbf59f933b";

// function App() {
//   const [contract, setContract] = useState(null);
//   const [tokenId, setTokenId] = useState("");
//   const [remaining, setRemaining] = useState("");

//   const connectWallet = async () => {
//     if (!window.ethereum) {
//       alert("Cần cài MetaMask để dùng");
//       return;
//     }

//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const instance = new ethers.Contract(contractAddress, abi, signer);
//     setContract(instance);
//   };

//   const checkAccess = async () => {
//     if (!contract) {
//       alert("Bạn cần bấm Kết nối ví trước!");
//       return;
//     }
  
//     try {
//       const result = await contract.remainingAccess(tokenId);
//       setRemaining(result.toString());
//     } catch (error) {
//       console.error("Lỗi khi kiểm tra tokenId:", error);
//       alert("Token ID chưa được mint hoặc lỗi contract.");
//     }
//   };

//   const useNFT = async () => {
//     if (!contract) {
//       alert("Bạn cần bấm Kết nối ví trước!");
//       return;
//     }
  
//     try {
//       const tx = await contract.accessNFT(tokenId);
//       await tx.wait();
//       alert("Dùng NFT thành công!");
//       checkAccess();
//     } catch (error) {
//       console.error("Lỗi khi dùng NFT:", error);
//       alert("Không thể dùng NFT.");
//     }
//   };
  
//   return (
//     <div style={{ padding: "2rem", fontFamily: "Arial" }}>
//       <h1>NFT Giới Hạn Lượt Truy Cập</h1>
//       <button onClick={connectWallet}>Kết nối MetaMask</button>
//       <div style={{ marginTop: 20 }}>
//         <input
//           type="text"
//           placeholder="Nhập tokenId..."
//           onChange={(e) => setTokenId(e.target.value)}
//         />
//         <button onClick={checkAccess}>Kiểm tra lượt còn</button>
//         <p>Lượt còn lại: {remaining}</p>
//         <button onClick={useNFT}>Dùng NFT</button>
//       </div>
//     </div>
//   );
// }

// export default App;




import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi.json";

const contractAddress = "0x97c03AdC44eaCEd3f859C6d6cD7c97Df0809f682"; // Địa chỉ bạn đã deploy trên Remix

function App() {
  const [contract, setContract] = useState(null);
  const [tokenId, setTokenId] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [remaining, setRemaining] = useState("");
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Cần cài MetaMask!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const nft = new ethers.Contract(contractAddress, abi, signer);
    setContract(nft);
    setWalletConnected(true);
    alert("🟢 Ví đã kết nối!");
  };

  const checkAccess = async () => {
    if (!contract) return alert("Bạn cần kết nối ví trước");
    try {
      const result = await contract.remainingAccess(tokenId);
      setRemaining(result.toString());
    } catch (err) {
      alert("Token ID chưa được mint hoặc lỗi contract.");
      console.error(err);
    }
  };

  const viewImage = async () => {
    if (!contract) return alert("Bạn cần kết nối ví trước");
    try {
      const res = await contract.viewImage(tokenId);
      setImageURL(res.toString()); // ép về dạng chuỗi URL
      checkAccess(); // Cập nhật số lượt còn lại
    } catch (err) {
      alert("⚠️ Hết lượt truy cập hoặc token không hợp lệ.");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "1rem" }}>
        🖼️ NFT Ảnh Giới Hạn Truy Cập
      </h1>

      <button
        onClick={connectWallet}
        style={{
          background: walletConnected ? "#aaa" : "#4f46e5",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          marginBottom: "1rem",
          cursor: "pointer"
        }}
        disabled={walletConnected}
      >
        {walletConnected ? "✅ Đã kết nối" : "Kết nối MetaMask"}
      </button>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Nhập Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
          style={{ padding: "10px", width: "60%", marginRight: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button onClick={checkAccess} style={{ padding: "10px 16px", borderRadius: "6px", backgroundColor: "#10b981", color: "white", cursor: "pointer" }}>
          Kiểm tra
        </button>
      </div>

      {remaining !== "" && (
        <p style={{ fontSize: "16px", marginBottom: "1rem" }}>
          🎯 Lượt truy cập còn lại: <strong>{remaining}</strong>
        </p>
      )}

      <button
        onClick={viewImage}
        style={{ backgroundColor: "#3b82f6", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", marginBottom: "1.5rem" }}
      >
        Xem ảnh
      </button>

      {imageURL && (
        <div>
          <img src={imageURL} alt="NFT" style={{ maxWidth: "100%", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }} />
        </div>
      )}
    </div>
  );
}

export default App;
