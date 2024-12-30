import { Box, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import React from "react";
import Seat from "./Seat";

// Compartment component that displays the seat grid and booking status.
export default function Compartment({ loading, data }) {
  // Calculate booked and available seats
  const { bookedSeatsCount, availableSeatsCount } = data?.reduce(
    (acc, item) => {
      if (item.isBooked) acc.bookedSeatsCount++;
      else acc.availableSeatsCount++;
      return acc;
    },
    { bookedSeatsCount: 0, availableSeatsCount: 0 }
  ) || { bookedSeatsCount: 0, availableSeatsCount: 0 };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      h="full"
      gap={4}
    >
      {/* Display loading or heading */}
      <Heading size="md" textAlign="center">
        {loading ? "Please Wait." : "Ticket Booking"}
      </Heading>

      {/* Seat grid */}
      <Grid
        templateColumns="repeat(7, 1fr)"
        gap={2}
        bg="#FAFAFA"
        minH="fit-content"
        h="80vh"
        minW="400px"
        w="fit-content"
        rounded="lg"
        p={4}
      >
        {data?.map((item) => (
          <Seat
            key={item._id}
            isBooked={item.isBooked}
            seatNumber={item.seatNumber}
          />
        ))}
      </Grid>

      {/* Booking status labels */}
      <Flex
        gap={4}
        justify="space-around"
        align="center"
        w="100%"
        maxW="500px"
        color="gray.700"
        fontWeight="bold"
      >
        <Text textAlign="center" bg="#FFC107" rounded="lg" p={2} flex="1">
          Booked Seats: {bookedSeatsCount}
        </Text>
        <Text textAlign="center" bg="#6CAC48" rounded="lg" p={2} flex="1">
          Available Seats: {availableSeatsCount}
        </Text>
      </Flex>
    </Box>
  );
}