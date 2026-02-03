// 1️⃣ Check GenLayer loaded
if (!window.genlayer) {
  alert("GenLayer SDK not loaded");
  throw new Error("GenLayer SDK missing");
}

// 2️⃣ Setup provider
const provider = new genlayer.Provider({
  network: "testnet",
});

// 3️⃣ Your deployed contract address
const CONTRACT_ADDRESS = "0x991B6E5CB3AB9B7000fDa5aA8A143A0DE6CDE00D";

const contract = provider.getContract(CONTRACT_ADDRESS);
// ===============================
async function joinRoom() {
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
}


function submitAnswer() {
  const answer = document.getElementById("answer").value.trim();
  console.log("Answer:", answer);

  if (!answer) {
    alert("Enter an answer");
    return;
  }

  await contract.submitAnswer(roomCode, playerId, answer);
}

function finalizeGame() {
  console.log("Finalize clicked");
  await contract.finalize(roomCode);
}
