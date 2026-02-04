let contract = null;
window.roomCode = null;
window.playerId = null;

async function initGenLayer() {
  console.log("initGenLayer running");

  let tries = 0;
  while (!window.tronWeb && tries < 20) {
    await new Promise(r => setTimeout(r, 300));
    tries++;
  }

  if (!window.tronWeb) {
    alert("Please install and unlock TronLink");
    return;
  }

  contract = await window.tronWeb.contract().at(
    "0x991B6E5CB3AB9B7000fDa5aA8A143A0DE6CDE00D"
  );

  window.contract = contract;
  console.log("Contract loaded", contract);
}

window.addEventListener("load", initGenLayer);

// ===============================
// JOIN ROOM
window.joinRoom = async function () {
  if (!window.contract) {
    alert("Contract not ready yet. Wait 2 seconds.");
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

    // ✅ SAVE FOR LATER
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
    alert("Answer submitted!");
  } catch (err) {
    console.error(err);
    alert("Failed to submit answer");
  }
};

// ===============================
// FINALIZE GAME (HOST)
window.finalize = async function () {
  if (!window.contract || !window.roomCode) {
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
