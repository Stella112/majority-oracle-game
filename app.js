// 1️⃣ Check GenLayer loaded
if (!window.GenLayer) {
  alert("GenLayer SDK not loaded");
  throw new Error("GenLayer SDK missing");
}

// 2️⃣ Setup provider
const provider = new GenLayer.Provider({
  network: "testnet",
});

// 3️⃣ Your deployed contract address
const CONTRACT_ADDRESS = "0x991B6E5CB3AB9B7000fDa5aA8A143A0DE6CDE00D";

const contract = provider.getContract(CONTRACT_ADDRESS);
// ===============================
window.joinRoom = async function () {
  const roomCode = document.getElementById("roomCode").value.trim();
  const playerId = document.getElementById("playerId").value.trim();
  const playerName = document.getElementById("playerName").value.trim();

  if (!roomCode || !playerId || !playerName) {
    alert("Please fill all fields");
    return;
  }

  try {
    await contract.joinRoom(roomCode, playerId, playerName);
    alert("Successfully joined room!");
  } catch (err) {
    console.error(err);
    alert("Failed to join room");
  }
};

window.submitAnswer = async function () {
  const answer = document.getElementById("answer").value.trim();

  if (!answer) {
    alert("Enter an answer");
    return;
  }

  try {
    await contract.submitAnswer(roomCode, playerId, answer);
    alert("Answer submitted!");
  } catch (err) {
    console.error(err);
    alert("Failed to submit answer");
  }
};

window.finalize = async function () {
  try {
    await contract.finalize(roomCode);
    alert("Game finalized!");
  } catch (err) {
    console.error(err);
    alert("Failed to finalize game");
  }
};
