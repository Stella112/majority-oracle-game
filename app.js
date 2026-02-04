
// ===============================
// GLOBAL STATE
// ===============================
let provider = null;
let contract = null;
let contractReady = false;

window.roomCode = null;
window.playerId = null;
window.playerName = null;

const CONTRACT_ADDRESS = "0xabdC1A9eeBCD2D0C70b7c6a6a9655a715c6eb52a";

// ===============================
// INIT GENLAYER + METAMASK
// ===============================
async function initGenLayer() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  provider = new GenLayer.EvmProvider(window.ethereum);
  contract = provider.getContract(CONTRACT_ADDRESS);

  window.contract = contract;
  contractReady = true;

  document.getElementById("createBtn").disabled = false;
  document.getElementById("joinBtn").disabled = false;

  console.log("Contract ready:", CONTRACT_ADDRESS);
}

window.addEventListener("load", initGenLayer);

// ===============================
// CREATE ROOM
// ===============================
window.createRoom = async function () {
  if (!contractReady) {
    alert("Contract loading, wait a second");
    return;
  }

  const roomCode = document.getElementById("roomCode").value.trim();
  const prompt = document.getElementById("promptInput").value.trim();

  if (!roomCode || !prompt) {
    alert("Enter room code and prompt");
    return;
  }

  try {
    await contract.create_room(roomCode, prompt).send();
    window.roomCode = roomCode;
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
    alert("Contract loading, wait a second");
    return;
  }

  const roomCode = document.getElementById("roomCode").value.trim();
  const playerId = document.getElementById("playerId").value.trim();
  const playerName = document.getElementById("playerName").value.trim();

  if (!roomCode || !playerId || !playerName) {
    alert("Fill all fields");
    return;
  }

  try {
    await contract.join(roomCode, playerId, playerName).send();
    window.roomCode = roomCode;
    window.playerId = playerId;
    window.playerName = playerName;
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
  if (!contractReady || !window.roomCode || !window.playerId) {
    alert("Join room first");
    return;
  }

  const answer = document.getElementById("answer").value.trim();
  if (!answer) {
    alert("Enter an answer");
    return;
  }

  try {
    await contract.submit(window.roomCode, window.playerId, answer).send();
    alert("Answer submitted");
  } catch (e) {
    console.error(e);
    alert("Submit failed");
  }
};

// ===============================
// FINALIZE
// ===============================
window.finalize = async function () {
  if (!contractReady || !window.roomCode) {
    alert("Create or join a room first");
    return;
  }

  try {
    await contract.finalize(window.roomCode).send();
    alert("Game finalized");
  } catch (e) {
    console.error(e);
    alert("Finalize failed");
  }
};
