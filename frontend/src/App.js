import "./App.css";
import { Flex } from "@chakra-ui/react";
import Compartment from "./components/Compartment";
import InputBox from "./components/InputBox";
import axios from "axios";
import { useEffect, useState } from "react";

/**
 * App Component
 * The main application component managing seat data and rendering the UI.
 */
function App() {
  // State to store seat data and loading status
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch seat data when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetch seat data from the server.
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://seat-booking-tg8y.onrender.com/api/seats"
      );
      setData(response.data.availableSeats);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      justify="space-around"
      align="center"
      h="100vh"
      minH="fit-content"
      bg="#E5E7EB"
    >
      {/* Compartment component for displaying seat grid */}
      <Compartment data={data} loading={loading} />

      {/* InputBox component for booking and resetting seats */}
      <InputBox fetchData={fetchData} />
    </Flex>
  );
}

export default App;
