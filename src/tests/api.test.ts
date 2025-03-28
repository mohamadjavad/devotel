import axios from "axios";
import { getStates } from "../services/api";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("API Service", () => {
  describe("getStates", () => {
    beforeEach(() => {
      // Reset mocks before each test
      jest.clearAllMocks();
    });

    it("should return an array of states with label and value properties", async () => {
      // Mock API response
      const mockResponse = {
        data: {
          country: "USA",
          states: ["California", "Texas", "New York", "Florida"],
        },
      };

      // Setup mock implementation
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Execute the function
      const result = await getStates("USA");

      // Verify the API was called with the expected URL
      expect(mockedAxios.get).toHaveBeenCalledWith("/getStates?country=USA");

      // Verify the result has the expected format
      expect(result).toHaveLength(4);
      expect(result).toEqual([
        { label: "California", value: "California" },
        { label: "Texas", value: "Texas" },
        { label: "New York", value: "New York" },
        { label: "Florida", value: "Florida" },
      ]);
    });

    it("should return an empty array if the API response has no states", async () => {
      // Mock API response with no states
      const mockResponse = {
        data: {
          country: "USA",
          states: [],
        },
      };

      // Setup mock implementation
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      // Execute the function
      const result = await getStates("USA");

      // Verify the result is an empty array
      expect(result).toEqual([]);
    });

    it("should return an empty array if the API call fails", async () => {
      // Setup mock implementation to reject
      mockedAxios.get.mockRejectedValueOnce(new Error("API error"));

      // Execute the function
      const result = await getStates("USA");

      // Verify the result is an empty array
      expect(result).toEqual([]);
    });
  });
});
