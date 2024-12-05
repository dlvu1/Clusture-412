const express = require("express");
const router = express.Router();

// Mock user data
const users = [
    { id: 1, username: "zach", email: "zach@example.com" },
    { id: 2, username: "alex", email: "alex@example.com" }
];

// GET all users
router.get("/", (req, res) => {
    res.json(users);
});

// POST a new user
router.post("/", (req, res) => {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

module.exports = router;

