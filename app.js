// Replace with your BRADBURY deployed address
const CONTRACT_ADDRESS = "0xabdC1A9eeBCD2D0C70b7c6a6a9655a715c6eb52a";

let client;
let userAddress;

async function init() {
    const statusText = document.getElementById("status-text");
    const logEl = document.getElementById("leaderboard");

    // 1. Hunt for the SDK variable (It can be named differently depending on the version)
    const sdk = window.genlayer || window.GenLayerJS || window.GenLayer;

    if (!sdk) {
        statusText.innerText = "⏳ SDK NOT DETECTED - RETRYING...";
        setTimeout(init, 1000); 
        return;
    }

    // 2. MetaMask Check
    if (!window.ethereum) {
        statusText.innerText = "❌ METAMASK NOT FOUND";
        logEl.innerText = "Please install MetaMask or Zerion extension.";
        return;
    }

    try {
        statusText.innerText = "⏳ CONNECTING WALLET...";
        
        // 3. Request Accounts
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userAddress = accounts[0];

        // 4. Create Client for BRADBURY
        client = sdk.createClient({
            chain: sdk.bradbury, // Updated for Bradbury testnet
            transport: sdk.custom(window.ethereum)
        });

        statusText.innerText = "✅ BRADBURY CONNECTED: " + userAddress.substring(0, 8);
        logEl.innerText = "System online. Join a room to begin.";
        
    } catch (error) {
        console.error(error);
        statusText.innerText = "❌ CONNECTION FAILED";
        logEl.innerText = "Error: " + error.message;
    }
}

// Kick off the init on load
window.addEventListener("load", init);

// ==========================================
// 🕹️ GAME ACTIONS
// ==========================================

async function createRoom() {
    try {
        const rc = document.getElementById("roomCode").value;
        const prompt = document.getElementById("promptInput").value;
        const hash = await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "create_room",
            args: [rc, prompt],
            account: userAddress
        });
        alert("Success! Tx Hash: " + hash);
    } catch (e) { alert("Error: " + e.message); }
}

async function joinRoom() {
    try {
        const rc = document.getElementById("roomCode").value;
        const name = document.getElementById("playerName").value;
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "join",
            args: [rc, name, name],
            account: userAddress
        });
        alert("Room Joined!");
    } catch (e) { alert("Error: " + e.message); }
}

async function submitAnswer() {
    try {
        const rc = document.getElementById("roomCode").value;
        const name = document.getElementById("playerName").value;
        const ans = document.getElementById("answer").value;
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "submit",
            args: [rc, name, ans],
            account: userAddress
        });
        alert("Answer Submitted!");
    } catch (e) { alert("Error: " + e.message); }
}

async function runConsensus() {
    try {
        const rc = document.getElementById("roomCode").value;
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "run_consensus",
            args: [rc],
            account: userAddress
        });
        alert("AI Consensus Triggered! Validators are now judging.");
    } catch (e) { alert("Error: " + e.message); }
}

async function finalize() {
    try {
        const rc = document.getElementById("roomCode").value;
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "finalize",
            args: [rc],
            account: userAddress
        });
        
        // Read the final scores
        const scores = await client.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "get_scores",
            args: []
        });
        document.getElementById("leaderboard").innerText = JSON.stringify(scores, null, 2);
    } catch (e) { alert("Error: " + e.message); }
}

