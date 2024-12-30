const express = require("express");
const router = express.Router();

// Import controllers
const {
  bookingController,
  resetSeatsController,
  getSeats,
} = require("../controller/seats.controller");

// Routes
// Reset all seats to available
router.post("/", resetSeatsController);

// Get all seats
router.get("/", getSeats);

// Book seats
router.post("/book", bookingController);

module.exports = router;
