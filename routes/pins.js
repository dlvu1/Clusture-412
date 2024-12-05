const express = require("express");
const router = express.Router();

// Mock pin data
const pins = [
    { id: 1, title: "Beach Sunset", imageUrl: "https://example.com/beach.jpg", boardId: 1, userId: 1 },
    { id: 2, title: "Chocolate Cake Recipe", imageUrl: "https://example.com/cake.jpg", boardId: 2, userId: 2 }
];

// GET all pins
router.get("/", (req, res) => {
    res.json(pins);
});

// GET pins by boardId
router.get("/board/:boardId", (req, res) => {
    const boardPins = pins.filter(pin => pin.boardId === parseInt(req.params.boardId));
    res.json(boardPins);
});

// POST a new pin
router.post("/", (req, res) => {
    const newPin = { id: pins.length + 1, ...req.body };
    pins.push(newPin);
    res.status(201).json(newPin);
});

// DELETE a pin by ID
router.delete("/:id", (req, res) => {
    const pinIndex = pins.findIndex(pin => pin.id === parseInt(req.params.id));
    if (pinIndex > -1) {
        const deletedPin = pins.splice(pinIndex, 1); // Remove the pin from the mock array
        res.json({ message: "Pin deleted", pin: deletedPin });
    } else {
        res.status(404).json({ message: "Pin not found" });
    }
});

// UPDATE a pin by ID
router.put("/:id", (req, res) => {
    const pinIndex = pins.findIndex(pin => pin.id === parseInt(req.params.id));
    if (pinIndex > -1) {
        pins[pinIndex] = { ...pins[pinIndex], ...req.body }; // Merge new data into the pin
        res.json({ message: "Pin updated", pin: pins[pinIndex] });
    } else {
        res.status(404).json({ message: "Pin not found" });
    }
});


module.exports = router;
