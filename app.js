const CONTRACT_ADDRESS = "0xabdC1A9eeBCD2D0C70b7c6a6a9655a715c6eb52a";
let client;
let userAddress;

async function init() {
    const statusText = document.getElementById("status-text");
    const logBox = document.getElementById("leaderboard");

    // 1. Check if the SDK is loaded in the browser
    const sdk = window.GenLayerJS; 
    if (!sdk) {
        statusText.innerText = "❌ SDK Not Found. Retrying...";
        setTimeout(init, 2000); // Try again in 2 seconds
        return;
    }

    // 2. Check for MetaMask
    if (!window.ethereum) {
        statusText.innerText = "❌ MetaMask Missing";
        alert("Please install MetaMask!");
        return;
    }

    try {
        // 3. Connect Wallet
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        userAddress = accounts[0];

        // 4. Initialize GenLayer Client
        // We use 'testnetAsimov' for the public testnet
        client = sdk.createClient({
            chain: sdk.testnetAsimov,
            transport: sdk.custom(window.ethereum)
        });

        statusText.innerText = "✅ Connected to " + userAddress.substring(0, 8) + "...";
        statusText.style.color = "green";
        logBox.innerText = "Wallet linked. Ready to play!";

    } catch (err) {
        statusText.innerText = "❌ Connection Failed";
        logBox.innerText = "Error: " + err.message;
    }
}

// Start when page loads
window.addEventListener("load", init);

// --- Game Functions ---

window.createRoom = async () => {
    const code = document.getElementById("roomCode").value;
    const prompt = document.getElementById("promptInput").value;
    try {
        const hash = await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "create_room",
            args: [code, prompt],
            account: userAddress
        });
        alert("Tx Sent! Hash: " + hash);
    } catch (e) { alert("Error: " + e.message); }
};

window.joinRoom = async () => {
    const code = document.getElementById("roomCode").value;
    const name = document.getElementById("playerName").value;
    try {
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "join",
            args: [code, name, name],
            account: userAddress
        });
        alert("Joined!");
    } catch (e) { alert("Error: " + e.message); }
};

window.submitAnswer = async () => {
    const code = document.getElementById("roomCode").value;
    const name = document.getElementById("playerName").value;
    const ans = document.getElementById("answer").value;
    try {
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "submit",
            args: [code, name, ans],
            account: userAddress
        });
        alert("Submitted!");
    } catch (e) { alert("Error: " + e.message); }
};

window.runConsensus = async () => {
    const code = document.getElementById("roomCode").value;
    try {
        await client.writeContract({
            address: CONTRACT_ADDRESS,
            functionName: "run_consensus",
            args: [code],
            account: userAddress
        });
        alert("AI Consensus started. Check back in 30 seconds!");
    } catch (e) { alert("Error: " + e.message); }
};

window.finalize = async () => {
    try {
        const scores = await client.readContract({
            address: CONTRACT_ADDRESS,
            functionName: "get_scores",
            args: []
        });
        document.getElementById("leaderboard").innerText = JSON.stringify(scores, null, 2);
    } catch (e) { alert("Error: " + e.message); }
};
