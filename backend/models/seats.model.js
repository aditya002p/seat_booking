const mongoose = require("mongoose");

// Define the schema for seats
const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: Number,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    rowNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create the Seat model
const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;
