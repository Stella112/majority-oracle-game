// ===============================
// STATE
// ===============================
let provider;
let contract;
let contractReady = false;

let roomCode = "";
let playerName = "";
let playerId = "";

const CONTRACT_ADDRESS = "0xabdC1A9eeBCD2D0C70b7c6a6a9655a715c6eb52a";

// ===============================
// INIT
// ===============================
async function init() {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  // 🔑 FORCE METAMASK POPUP
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  playerId = accounts[0];

  // ✅ CORRECT SDK USAGE (LOWERCASE genlayer)
  provider = new genlayer.EvmProvider(window.ethereum);
  contract = provider.getContract(CONTRACT_ADDRESS);

  if (!contract) {
    alert("Contract failed to load");
    return;
  }

  contractReady = true;

  document.getElementById("createBtn").disabled = false;
  document.getElementById("joinBtn").disabled = false;

  console.log("✅ Contract ready");
}

window.addEventListener("load", init);

// ===============================
// CREATE ROOM
// ===============================
async function createRoom() {
  if (!contractReady) return alert("Contract loading");

  roomCode = document.getElementById("roomCode").value.trim();
  playerName = document.getElementById("playerName").value.trim();
  const prompt = document.getElementById("promptInput").value.trim();

  if (!roomCode || !playerName || !prompt) {
    return alert("Fill all fields");
  }

  try {
    await contract.create_room(roomCode, prompt);
    alert("Room created");
  } catch (e) {
    console.error(e);
    alert("Create room failed");
  }
}

// ===============================
// JOIN ROOM
// ===============================
async function joinRoom() {
  if (!contractReady) return alert("Contract loading");

  roomCode = document.getElementById("roomCode").value.trim();
  playerName = document.getElementById("playerName").value.trim();

  if (!roomCode || !playerName) {
    return alert("Fill all fields");
  }

  try {
    await contract.join(roomCode, playerId, playerName);
    alert("Joined room");
  } catch (e) {
    console.error(e);
    alert("Join failed");
  }
}

// ===============================
// SUBMIT ANSWER
// ===============================
async function submitAnswer() {
  if (!roomCode) return alert("Join a room first");

  const answer = document.getElementById("answer").value.trim();
  if (!answer) return alert("Enter an answer");

  try {
    await contract.submit(roomCode, playerId, answer);
    alert("Answer submitted");
  } catch (e) {
    console.error(e);
    alert("Submit failed");
  }
}

// ===============================
// CONSENSUS
// ===============================
async function runConsensus() {
  try {
    await contract.run_consensus(roomCode);
    alert("Consensus run");
  } catch (e) {
    console.error(e);
    alert("Consensus failed");
  }
}

// ===============================
// FINALIZE
// ===============================
async function finalize() {
  try {
    await contract.finalize(roomCode);
    alert("Game finalized");
  } catch (e) {
    console.error(e);
    alert("Finalize failed");
  }
}
