let provider;
let contract;

// persist across actions
window.roomCode = null;
window.playerId = null;

const CONTRACT_ADDRESS = "0x991B6E5CB3AB9B7000fDa5aA8A143A0DE6CDE00D";

async function initGenLayer() {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  // request wallet connection
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // ✅ GenLayer EVM provider (uses MetaMask)
  provider = new GenLayer.EvmProvider(window.ethereum);

  contract = provider.getContract(CONTRACT_ADDRESS);
  window.contract = contract;

  console.log("GenLayer EVM contract loaded", contract);
}

window.addEventListener("load", initGenLayer);

// ===============================
// JOIN ROOM
window.joinRoom = async function () {
  if (!window.contract) {
    alert("Contract not ready yet");
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
    await contract.joinRoom(roomCode, playerId, playerName);

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
  if (!window.contract || !window.roomCode || !window.playerId) {
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
    alert("Answer submitted");
  } catch (err) {
    console.error(err);
    alert("Submit failed");
  }
};

// ===============================
// FINALIZE (HOST)
window.finalize = async function () {
  if (!window.contract || !window.roomCode) {
    alert("Join a room first");
    return;
  }

  try {
    await contract.finalize(window.roomCode);
    alert("Game finalized");
  } catch (err) {
    console.error(err);
    alert("Finalize failed");
  }
};
