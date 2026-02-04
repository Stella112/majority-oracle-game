// Change this to your deployed contract address
const CONTRACT_ADDRESS = "0xabdC1A9eeBCD2D0C70b7c6a6a9655a715c6eb52a";

let client;
let userAddress;

// ==========================================
// 🚀 INITIALIZATION
// ==========================================

async function init() {
    const statusEl = document.getElementById("status");
    const logEl = document.getElementById("leaderboard");

    // 1. Wait for SDK to load in browser
    if (typeof genlayer === "undefined") {
        statusEl.innerText = "⏳ SDK still loading... please wait.";
        setTimeout(init, 1000); // Try again in 1 second
        return;
    }

    // 2. Check for MetaMask
    if (!window.ethereum) {
        statusEl.innerText = "❌ MetaMask Not Found";
        alert("Please install MetaMask or Zerion!");
        return;
    }

    try {
        statusEl.innerText = "⏳ Connecting to MetaMask...";
        
        // 3. Get Wallet Address
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userAddress = accounts[0];

        // 4. Create GenLayer Client (v0.2.x pattern)
        // Note: Using 'testnetAsimov' which is the current GenLayer testnet
        client = genlayer.createClient({
            chain: genlayer.testnetAsimov,
            transport: genlayer.custom(window.ethereum)
        });

        statusEl.innerText = "✅ Connected: " + userAddress.substring(0, 6) + "...";
        statusEl.style.color = "green";
        logEl.innerText = "Ready to interact with contract!";
        
    } catch (error) {
        console.error(error);
        statusEl.innerText = "❌ Connection Failed";
        logEl.innerText = "Error: " + error.message;
    }
}

// Start when the page loads
window.addEventListener("load", init);

// ==========================================
// 🎮 GAME FUNCTIONS
// ==========================================

async function createRoom() {
    const rc = document.getElementById("roomCode").value;
    const prompt = document.getElementById("promptInput").value;
    
    if (!rc || !prompt) return alert("Enter Room Code and Prompt!");

    try {
        const hash = await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "create_room",
            args: [rc, prompt],
            account: userAddress
        });
        alert("Room Creation Sent! Tx Hash: " + hash);
    } catch (e) {
        alert("Error: " + e.message);
    }
}

async function joinRoom() {
    const rc = document.getElementById("roomCode").value;
    const name = document.getElementById("playerName").value;

    try {
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "join",
            args: [rc, name, name], // Passing nickname twice for simplicity
            account: userAddress
        });
        alert("Joined Room!");
    } catch (e) {
        alert("Join failed: " + e.message);
    }
}

async function submitAnswer() {
    const rc = document.getElementById("roomCode").value;
    const name = document.getElementById("playerName").value;
    const ans = document.getElementById("answer").value;

    try {
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "submit",
            args: [rc, name, ans],
            account: userAddress
        });
        alert("Answer Submitted!");
    } catch (e) {
        alert("Submit failed: " + e.message);
    }
}

async function runConsensus() {
    const rc = document.getElementById("roomCode").value;
    try {
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "run_consensus",
            args: [rc],
            account: userAddress
        });
        alert("AI Consensus started! Wait a few seconds for validators...");
    } catch (e) {
        alert("Consensus Error: " + e.message);
    }
}

async function finalize() {
    const rc = document.getElementById("roomCode").value;
    try {
        // Step 1: Run finalize logic
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "finalize",
            args: [rc],
            account: userAddress
        });

        // Step 2: Read the scores (Read operation)
        const scores = await client.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "get_scores",
            args: []
        });

        document.getElementById("leaderboard").innerText = JSON.stringify(scores, null, 2);
    } catch (e) {
        alert("Finalize Error: " + e.message);
    }
}
