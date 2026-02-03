function joinRoom() {
  const roomCode = document.getElementById("roomCode").value.trim();
  const playerId = document.getElementById("playerId").value.trim();
  const playerName = document.getElementById("playerName").value.trim();

  console.log("Join Room clicked:", roomCode, playerId, playerName);

  if (!roomCode || !playerId || !playerName) {
    alert("Please fill all fields");
    return;
  }

  await contract.join(roomCode, playerId, playerName);
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
