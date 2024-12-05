const express = require("express");
const router = express.Router();

// Mock board data
const boards = [
    { id: 1, name: "Travel Ideas", description: "A board for travel pins", userId: 1 },
    { id: 2, name: "Recipe Board", description: "Cooking recipes and ideas", userId: 2 }
];

// GET all boards
router.get("/", (req, res) => {
    res.json(boards);
});

// GET boards by userId
router.get("/:userId", (req, res) => {
    const userBoards = boards.filter(board => board.userId === parseInt(req.params.userId));
    res.json(userBoards);
});

// POST a new board
router.post("/", (req, res) => {
    const newBoard = { id: boards.length + 1, ...req.body };
    boards.push(newBoard);
    res.status(201).json(newBoard);
});

// DELETE a board by ID
router.delete("/:id", (req, res) => {
    const boardIndex = boards.findIndex(board => board.id === parseInt(req.params.id));
    if (boardIndex > -1) {
        const deletedBoard = boards.splice(boardIndex, 1); // Remove the board
        res.json({ message: "Board deleted", board: deletedBoard });
    } else {
        res.status(404).json({ message: "Board not found" });
    }
});

// UPDATE a board by ID
router.put("/:id", (req, res) => {
    const boardIndex = boards.findIndex(board => board.id === parseInt(req.params.id));
    if (boardIndex > -1) {
        boards[boardIndex] = { ...boards[boardIndex], ...req.body }; // Merge new data
        res.json({ message: "Board updated", board: boards[boardIndex] });
    } else {
        res.status(404).json({ message: "Board not found" });
    }
});

module.exports = router;
