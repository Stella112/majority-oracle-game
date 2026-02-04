
// ===============================
// GLOBAL STATE
// ===============================
let provider;
let contract;
let roomCode = null;
let playerId = null;

const CONTRACT_ADDRESS = "0xabdC1A9eeBCD2D0C70b7c6a6a9655a715c6eb52a";

// ===============================
// INIT (MetaMask + GenLayer)
// ===============================
async function init() {
  if (!window.ethereum) {
    alert("MetaMask not found");
    return;
  }

  // Force MetaMask popup ON LOAD
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  playerId = accounts[0];

  provider = new GenLayer.EvmProvider(window.ethereum);
  contract = provider.getContract(CONTRACT_ADDRESS);

  window.contract = contract;

  console.log("✅ Contract ready");
}

window.addEventListener("load", init);

// ===============================
// CREATE ROOM
// ===============================
async function createRoom() {
  const code = document.getElementById("roomCode").value.trim();
  const prompt = document.getElementById("promptInput").value.trim();

  if (!code || !prompt) {
    alert("Room code & prompt required");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  await contract.create_room(code, prompt);
  roomCode = code;

  alert("Room created");
}

// ===============================
// JOIN ROOM
// ===============================
async function joinRoom() {
  const code = document.getElementById("roomCode").value.trim();
  const name = document.getElementById("playerName").value.trim();

  if (!code || !name) {
    alert("Room code & name required");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  await contract.join(code, playerId, name);
  roomCode = code;

  alert("Joined room");
}

// ===============================
// SUBMIT ANSWER
// ===============================
async function submitAnswer() {
  const answer = document.getElementById("answer").value.trim();
  if (!answer || !roomCode) return alert("Missing info");

  await window.ethereum.request({ method: "eth_requestAccounts" });

  await contract.submit(roomCode, playerId, answer);
  alert("Answer submitted");
}

// ===============================
// RUN CONSENSUS (AI)
// ===============================
async function runConsensus() {
  if (!roomCode) return alert("No room");

  await window.ethereum.request({ method: "eth_requestAccounts" });

  await contract.run_consensus(roomCode);
  alert("Consensus executed");
}

// ===============================
// FINALIZE
// ===============================
async function finalize() {
  if (!roomCode) return alert("No room");

  await window.ethereum.request({ method: "eth_requestAccounts" });

  await contract.finalize(roomCode);
  alert("Game finalized");
}
