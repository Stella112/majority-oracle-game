// ===============================
// GLOBAL STATE
// ===============================
let provider = null;
let contract = null;
let contractReady = false;

let roomCode = null;
let playerId = null;
let playerName = null;

const CONTRACT_ADDRESS = "0xabdC1A9eeBCD2D0C70b7c6a6a9655a715c6eb52a";

// ===============================
// INIT (MetaMask + GenLayer)
// ===============================
async function init() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  // 🔑 FORCE METAMASK POPUP
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  playerId = accounts[0];

  // ⚠️ MUST be lowercase genlayer
  provider = new genlayer.EvmProvider(window.ethereum);
  contract = provider.getContract(CONTRACT_ADDRESS);

  if (!contract) {
    alert("Contract failed to load");
    return;
  }

  window.contract = contract;
  contractReady = true;

  // ✅ ENABLE BUTTONS ONLY NOW
  document.getElementById("createBtn").disabled = false;
  document.getElementById("joinBtn").disabled = false;

  console.log("✅ Contract READY");
}

window.addEventListener("load", init);

// ===============================
// CREATE ROOM (HOST)
// ===============================
window.createRoom = async function () {
  if (!contractReady) {
    alert("Contract still loading, wait 1 second");
    return;
  }

  roomCode = document.getElementById("roomCode").value.trim();
  const prompt = document.getElementById("promptInput").value.trim();
  playerName = document.getElementById("playerName").value.trim();

  if (!roomCode || !prompt || !playerName) {
    alert("Fill all fields");
    return;
  }

  try {
    await contract.create_room(roomCode, prompt);
    alert("Room created");
  } catch (e) {
    console.error(e);
    alert("Create room failed");
  }
};

// ===============================
// JOIN ROOM
// ===============================
window.joinRoom = async function () {
  if (!contractReady) {
    alert("Contract still loading, wait 1 second");
    return;
  }

  roomCode = document.getElementById("roomCode").value.trim();
  playerName = document.getElementById("playerName").value.trim();

  if (!roomCode || !playerName) {
    alert("Fill all fields");
    return;
  }

  try {
    await contract.join(roomCode, playerId, playerName);
    alert("Joined room");
  } catch (e) {
    console.error(e);
    alert("Join failed");
  }
};

// ===============================
// SUBMIT ANSWER
// ===============================
window.submitAnswer = async function () {
  if (!contractReady || !roomCode) {
    alert("Join room first");
    return;
  }

  const answer = document.getElementById("answer").value.trim();
  if (!answer) {
    alert("Enter an answer");
    return;
  }

  try {
    await contract.submit(roomCode, playerId, answer);
    alert("Answer submitted");
  } catch (e) {
    console.error(e);
    alert("Submit failed");
  }
};

// ===============================
// CONSENSUS
// ===============================
window.runConsensus = async function () {
  try {
    await contract.run_consensus(roomCode);
    alert("Consensus calculated");
  } catch (e) {
    console.error(e);
    alert("Consensus failed");
  }
};

// ===============================
// FINALIZE
// ===============================
window.finalize = async function () {
  try {
    await contract.finalize(roomCode);
    alert("Game finalized");
  } catch (e) {
    console.error(e);
    alert("Finalize failed");
  }
};
