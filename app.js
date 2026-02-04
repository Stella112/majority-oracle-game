// ===============================
// CONFIG
// ===============================
const CONTRACT_ADDRESS = "0xabdC1A9eeBCD2D0C70b7c6a6a9655a715c6eb52a";

let provider;
let contract;
let roomCode = null;
let playerName = null;

// ===============================
// INIT
// ===============================
window.addEventListener("load", async () => {
    console.log("Checking for GenLayer...");

    // 1. Identify the SDK (checking common names)
    const sdk = window.GenLayer || window.genlayer;

    if (!sdk) {
        alert("GenLayer SDK not found. Check your internet connection.");
        return;
    }

    // 2. Check for Wallet
    if (!window.ethereum) {
        alert("Please install MetaMask or GenLayer Wallet extension.");
        return;
    }

    try {
        // 3. Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        // 4. Setup Provider & Contract
        // We use the 'sdk' variable we found in step 1
        provider = new sdk.EvmProvider(window.ethereum);
        contract = provider.getContract(CONTRACT_ADDRESS);

        console.log("✅ GenLayer Connected. Contract Address:", CONTRACT_ADDRESS);
    } catch (error) {
        console.error("Initialization error:", error);
        alert("Failed to connect wallet.");
    }
});

// ===============================
// GAME FUNCTIONS
// ===============================

window.createRoom = async function () {
    const rc = document.getElementById("roomCode").value.trim();
    const name = document.getElementById("playerName").value.trim();
    const prompt = document.getElementById("promptInput").value.trim();

    if (!rc || !name || !prompt) return alert("Fill all fields");

    roomCode = rc;
    playerName = name;

    try {
        console.log("Creating room...");
        await contract.create_room(rc, prompt);
        alert("✅ Room created successfully!");
    } catch (e) {
        console.error(e);
        alert("❌ Create room failed. See console for details.");
    }
};

window.joinRoom = async function () {
    const rc = document.getElementById("roomCode").value.trim();
    const name = document.getElementById("playerName").value.trim();

    if (!rc || !name) return alert("Fill all fields");

    roomCode = rc;
    playerName = name;

    try {
        await contract.join(rc, name, name);
        alert("✅ Joined room!");
    } catch (e) {
        console.error(e);
        alert("❌ Join failed.");
    }
};

window.submitAnswer = async function () {
    const answer = document.getElementById("answer").value.trim();
    if (!roomCode || !answer) return alert("Join a room first and enter an answer.");

    try {
        await contract.submit(roomCode, playerName, answer);
        alert("✅ Answer submitted!");
    } catch (e) {
        console.error(e);
        alert("❌ Submit failed.");
    }
};

window.runConsensus = async function () {
    if (!roomCode) return alert("No active room code.");
    try {
        await contract.run_consensus(roomCode);
        alert("✅ AI is now processing consensus...");
    } catch (e) {
        console.error(e);
        alert("❌ Consensus failed.");
    }
};

window.finalize = async function () {
    if (!roomCode) return alert("No active room code.");
    try {
        await contract.finalize(roomCode);
        const scores = await contract.get_scores();
        document.getElementById("leaderboard").innerText = JSON.stringify(scores, null, 2);
        alert("✅ Game finalized! Results updated.");
    } catch (e) {
        console.error(e);
        alert("❌ Finalize failed.");
    }
};
