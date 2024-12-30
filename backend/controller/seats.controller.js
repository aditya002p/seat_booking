const Seat = require("../models/seats.model");

// Helper function to find and book seats in the same row
const bookSeatsInSameRow = async (availableSeats, numOfSeats) => {
  const rowCount = 12;

  for (let row = 1; row <= rowCount; row++) {
    const rowSeats = availableSeats.filter((seat) => seat.rowNumber === row);
    const availableToBook = rowSeats
      .filter((seat) => !seat.isBooked)
      .slice(0, numOfSeats);

    if (availableToBook.length === numOfSeats) {
      await Promise.all(
        availableToBook.map((seat) => {
          seat.isBooked = true;
          return seat.save();
        })
      );
      return availableToBook;
    }
  }
  return null;
};

// Helper function to find nearby rows for seat booking
const findNearbyRows = (availableSeats, numOfSeats, rowCount) => {
  const rowAvailability = Array.from({ length: rowCount }, (_, row) => {
    return availableSeats.filter(
      (seat) => seat.rowNumber === row + 1 && !seat.isBooked
    ).length;
  });

  let minLength = Infinity;
  let minStart = -1;
  let sum = 0,
    start = 0;

  for (let end = 0; end < rowAvailability.length; end++) {
    sum += rowAvailability[end];

    while (sum >= numOfSeats) {
      const length = end - start + 1;
      if (length < minLength) {
        minLength = length;
        minStart = start;
      }
      sum -= rowAvailability[start++];
    }
  }

  if (minStart !== -1) {
    const rowsToBook = [];
    for (let row = minStart + 1; rowsToBook.length < numOfSeats; row++) {
      rowsToBook.push(
        ...availableSeats.filter(
          (seat) => seat.rowNumber === row && !seat.isBooked
        )
      );
    }
    return rowsToBook.slice(0, numOfSeats);
  }
  return [];
};

// Controller function to book seats
const bookingController = async (req, res) => {
  const { numOfSeats } = req.body;

  if (numOfSeats > 7) {
    return res
      .status(400)
      .json({ message: "Cannot book more than 7 seats at a time" });
  }

  try {
    const availableSeats = await Seat.find({ isBooked: false }).sort({
      rowNumber: 1,
      seatNumber: 1,
    });

    if (availableSeats.length < numOfSeats) {
      return res.status(400).json({
        message: `Booking failed, only ${availableSeats.length} seats are available`,
      });
    }

    // Attempt to book seats in the same row
    const sameRowSeats = await bookSeatsInSameRow(availableSeats, numOfSeats);
    if (sameRowSeats) {
      return res.status(200).json({ data: sameRowSeats });
    }

    // Attempt to book seats across nearby rows
    const rowCount = 12;
    const nearbySeats = findNearbyRows(availableSeats, numOfSeats, rowCount);

    if (nearbySeats.length > 0) {
      await Promise.all(
        nearbySeats.map((seat) => {
          seat.isBooked = true;
          return seat.save();
        })
      );
      return res.status(200).json({ data: nearbySeats });
    }

    return res
      .status(400)
      .json({ message: "Booking failed. Unable to find seats." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller function to get all seats
const getSeats = async (req, res) => {
  try {
    const seats = await Seat.find().sort({ rowNumber: 1, seatNumber: 1 });
    return res.status(200).json({ seats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller function to reset seats
const resetSeatsController = async (req, res) => {
  try {
    await Seat.deleteMany();

    const totalRows = 12;
    const seatsPerRow = 7;

    const seats = [];
    let seatNumber = 1;

    for (let row = 1; row <= totalRows; row++) {
      const rowSeats = row === totalRows ? 80 % seatsPerRow : seatsPerRow;

      for (let seatNum = 1; seatNum <= rowSeats; seatNum++) {
        seats.push(
          new Seat({
            seatNumber: seatNumber++,
            rowNumber: row,
            isBooked: false,
          })
        );
      }
    }

    await Seat.insertMany(seats);
    return res.json({ message: "Seats successfully reset" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { bookingController, getSeats, resetSeatsController };
