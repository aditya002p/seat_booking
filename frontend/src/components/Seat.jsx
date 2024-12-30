import { Box, Text } from "@chakra-ui/react";
import React from "react";

/**
 * Seat component to display seat number and booking status.
 *
 * @param {number} seatNumber - The number of the seat.
 * @param {boolean} isBooked - Indicates whether the seat is booked.
 */
export default function Seat({ seatNumber, isBooked }) {
  const seatBgColor = isBooked ? "#FFC107" : "#6CAC48";
  const seatTextColor = "gray.700";

  return (
    <Box
      color={seatTextColor}
      h="fit-content"
      w="50px"
      display="flex"
      justifyContent="center"
      p={1}
      bg={seatBgColor}
      rounded="lg"
    >
      <Text align="center" fontSize="md" as="b">
        {seatNumber}
      </Text>
    </Box>
  );
}
