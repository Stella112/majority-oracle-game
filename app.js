// ===============================
// GLOBAL STATE
// ===============================
let provider = null;
let contract = null;
let contractReady = false;

window.roomCode = null;
window.playerId = null;

const CONTRACT_ADDRESS = "0x991B6E5CB3AB9B7000fDa5aA8A143A0DE6CDE00D";

// ===============================
// INIT GENLAYER + METAMASK
// ===============================
async function initGenLayer() {
  console.log("initGenLayer running");

  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  // Request wallet connection
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Create GenLayer EVM provider (MetaMask-backed)
  provider = new GenLayer.EvmProvider(window.ethereum);

  // Get contract
  contract = provider.getContract(CONTRACT_ADDRESS);

  // Expose globally
  window.contract = contract;
  contractReady = true;

  console.log("GenLayer contract ready");
}

window.addEventListener("load", initGenLayer);

// ===============================
// JOIN ROOM
// ===============================
window.joinRoom = async function () {
  if (!contractReady) {
    alert("Please wait 1–2 seconds. Contract is loading…");
    return;
  }

  const roomCode = document.getElementById("roomCode").value.trim();
  const playerId = document.getElementById("playerId").value.trim();
  const playerName = document.getElementById("playerName").value.trim();

  if (!roomCode || !playerId || !playerName) {
    alert("Please fill all fields");
    return;
  }

  try {
    await contract.joinRoom(roomCode, playerId, playerName);

    // Save for later actions
    window.roomCode = roomCode;
    window.playerId = playerId;

    alert("Successfully joined room!");
  } catch (err) {
    console.error(err);
    alert("Failed to join room");
  }
};

// ===============================
// SUBMIT ANSWER
// ===============================
window.submitAnswer = async function () {
  if (!contractReady || !window.roomCode || !window.playerId) {
    alert("Join a room first");
    return;
  }

  const answer = document.getElementById("answer").value.trim();
  if (!answer) {
    alert("Enter an answer");
    return;
  }

  try {
    await contract.submitAnswer(window.roomCode, window.playerId, answer);
    alert("Answer submitted!");
  } catch (err) {
    console.error(err);
    alert("Failed to submit answer");
  }
};

// ===============================
// FINALIZE GAME (HOST)
// ===============================
window.finalize = async function () {
  if (!contractReady || !window.roomCode) {
    alert("Join a room first");
    return;
  }

  try {
    await contract.finalize(window.roomCode);
    alert("Game finalized!");
  } catch (err) {
    console.error(err);
    alert("Failed to finalize game");
  }
};
