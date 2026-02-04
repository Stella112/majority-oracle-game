let provider;
let signer;
let contract;

const CONTRACT_ADDRESS = "0x991B6E5CB3AB9B7000fDa5aA8A143A0DE6CDE00D";

// 🔹 MINIMAL ABI (only methods you use)
const ABI = [
  "function joinRoom(string roomCode, string playerId, string playerName)",
  "function submitAnswer(string roomCode, string playerId, string answer)",
  "function finalize(string roomCode)"
];

async function initEVM() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  // Request wallet connection
  await window.ethereum.request({ method: "eth_requestAccounts" });

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  window.contract = contract;

  console.log("EVM contract loaded");
}

window.addEventListener("load", initEVM);

// ===============================
// JOIN ROOM
window.joinRoom = async function () {
  const roomCode = document.getElementById("roomCode").value.trim();
  const playerId = document.getElementById("playerId").value.trim();
  const playerName = document.getElementById("playerName").value.trim();

  if (!roomCode || !playerId || !playerName) {
    alert("Fill all fields");
    return;
  }

  try {
    const tx = await contract.joinRoom(roomCode, playerId, playerName);
    await tx.wait();

    window.roomCode = roomCode;
    window.playerId = playerId;

    alert("Joined room");
  } catch (err) {
    console.error(err);
    alert("Join failed");
  }
};

// ===============================
// SUBMIT ANSWER
window.submitAnswer = async function () {
  if (!window.roomCode || !window.playerId) {
    alert("Join a room first");
    return;
  }

  const answer = document.getElementById("answer").value.trim();
  if (!answer) return alert("Enter an answer");

  try {
    const tx = await contract.submitAnswer(
      window.roomCode,
      window.playerId,
      answer
    );
    await tx.wait();

    alert("Answer submitted");
  } catch (err) {
    console.error(err);
    alert("Submit failed");
  }
};

// ===============================
// FINALIZE (HOST)
window.finalize = async function () {
  if (!window.roomCode) {
    alert("Join a room first");
    return;
  }

  try {
    const tx = await contract.finalize(window.roomCode);
    await tx.wait();

    alert("Game finalized");
  } catch (err) {
    console.error(err);
    alert("Finalize failed");
  }
};
