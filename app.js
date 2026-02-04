// ===============================
// GLOBAL STATE
// ===============================
let provider = null;
let contract = null;
let contractReady = false;

let roomCode = null;
let playerId = null;

const CONTRACT_ADDRESS = "0xabdC1A9eeBCD2D0C70b7c6a6a9655a715c6eb52a";

// ===============================
// INIT (MetaMask + GenLayer)
// ===============================
async function init() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  // MetaMask popup
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });
  playerId = accounts[0];

  // 🔑 IMPORTANT FIX: lowercase `genlayer`
  provider = new genlayer.EvmProvider(window.ethereum);
  contract = provider.getContract(CONTRACT_ADDRESS);

  window.contract = contract;
  contractReady = true;

  console.log("✅ Contract ready:", contract);
}

window.addEventListener("load", init);

// ===============================
// CREATE ROOM
// ===============================
async function createRoom() {
  if (!contractReady) {
    alert("Contract still loading, wait 1 second");
    return;
  }

  const code = document.getElementById("roomCode").value.trim();
  const prompt = document.getElementById("promptInput").value.trim();

  if (!code || !prompt) {
    alert("Room code and prompt required");
    return;
  }

  try {
    await contract.create_room(code, prompt);
    roomCode = code;
    alert("Room created successfully");
  } catch (err) {
    console.error(err);
    alert("Create room failed");
  }
}

// ===============================
// JOIN ROOM
// ===============================
async function joinRoom() {
  if (!contractReady) {
    alert("Contract still loading");
    return;
  }

  const code = document.getElementById("roomCode").value.trim();
  const name = document.getElementById("playerName").value.trim();

  if (!code || !name) {
    alert("Room code and name required");
    return;
  }

  try {
    await contract.join(code, playerId, name);
    roomCode = code;
    alert("Joined room");
  } catch (err) {
    console.error(err);
    alert("Join failed");
  }
}

// ===============================
// SUBMIT ANSWER
// ===============================
async function submitAnswer() {
  if (!contractReady || !roomCode) {
    alert("Join a room first");
    return;
  }

  const answer = document.getElementById("answer").value.trim();
  if (!answer) return alert("Enter an answer");

  try {
    await contract.submit(roomCode, playerId, answer);
    alert("Answer submitted");
  } catch (err) {
    console.error(err);
    alert("Submit failed");
  }
}

// ===============================
// RUN CONSENSUS
// ===============================
async function runConsensus() {
  if (!contractReady || !roomCode) {
    alert("No room");
    return;
  }

  try {
    await contract.run_consensus(roomCode);
    alert("Consensus complete");
  } catch (err) {
    console.error(err);
    alert("Consensus failed");
  }
}

// ===============================
// FINALIZE
// ===============================
async function finalize() {
  if (!contractReady || !roomCode) {
    alert("No room");
    return;
  }

  try {
    await contract.finalize(roomCode);
    alert("Game finalized");
  } catch (err) {
    console.error(err);
    alert("Finalize failed");
  }
}
