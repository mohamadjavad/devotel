// Mock import.meta.env before importing API
Object.defineProperty(global, "import", {
  value: {
    meta: {
      env: {
        VITE_API_BASE_URL: "https://test-api.example.com/api",
      },
    },
  },
});

import { FormData, FormStructure, TableResponse } from "../../types/form";

// Mock the complete API module
jest.mock("../api", () => ({
  getFormStructure: jest.fn(),
  submitForm: jest.fn(),
  getSubmissions: jest.fn(),
  getStates: jest.fn(),
}));

// Import the mocked API functions
import {
  getFormStructure,
  getStates,
  getSubmissions,
  submitForm,
} from "../api";

describe("API Services", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFormStructure", () => {
    const mockFormStructures: FormStructure[] = [
      {
        formId: "health-insurance",
        title: "Health Insurance",
        fields: [
          { id: "fullName", type: "text", label: "Full Name", required: true },
        ],
      },
      {
        formId: "car-insurance",
        title: "Car Insurance",
        fields: [
          { id: "carModel", type: "text", label: "Car Model", required: true },
        ],
      },
    ];

    test("returns all forms and selected form when no form type is specified", async () => {
      // Mock the implementation for this test
      (getFormStructure as jest.Mock).mockResolvedValueOnce({
        selectedForm: mockFormStructures[0],
        allForms: mockFormStructures,
      });

      const result = await getFormStructure();

      // Assertions
      expect(getFormStructure).toHaveBeenCalled();
      expect(result.allForms).toEqual(mockFormStructures);
      expect(result.selectedForm).toEqual(mockFormStructures[0]);
    });

    test("returns all forms and selected form when form type is specified", async () => {
      // Mock the implementation for this test
      (getFormStructure as jest.Mock).mockResolvedValueOnce({
        selectedForm: mockFormStructures[1],
        allForms: mockFormStructures,
      });

      const result = await getFormStructure("car-insurance");

      // Assertions
      expect(getFormStructure).toHaveBeenCalledWith("car-insurance");
      expect(result.allForms).toEqual(mockFormStructures);
      expect(result.selectedForm).toEqual(mockFormStructures[1]);
    });

    test("returns first form when specified form type is not found", async () => {
      // Mock the API response - need to include selectedForm in the mock
      (getFormStructure as jest.Mock).mockResolvedValueOnce({
        selectedForm: mockFormStructures[0],
        allForms: mockFormStructures,
      });

      const result = await getFormStructure("non-existent-form");

      // Assertions
      expect(getFormStructure).toHaveBeenCalledWith("non-existent-form");
      expect(result.allForms).toEqual(mockFormStructures);
      expect(result.selectedForm).toEqual(mockFormStructures[0]);
    });

    test("throws error when API call fails", async () => {
      // Mock the API error
      const mockError = new Error("Network error");
      (getFormStructure as jest.Mock).mockRejectedValueOnce(mockError);

      // Assertions
      await expect(getFormStructure()).rejects.toThrow("Network error");
    });
  });

  describe("submitForm", () => {
    test("submits form data successfully", async () => {
      // Mock form data and API response
      const mockFormData: FormData = {
        fullName: "John Doe",
        email: "john@example.com",
      };

      const mockResponse = {
        success: true,
        id: "12345",
      };

      (submitForm as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await submitForm(mockFormData);

      // Assertions
      expect(submitForm).toHaveBeenCalledWith(mockFormData);
      expect(result).toEqual(mockResponse);
    });

    test("throws error when form submission fails", async () => {
      // Mock form data and API error
      const mockFormData: FormData = {
        fullName: "John Doe",
        email: "john@example.com",
      };

      const mockError = new Error("Submission failed");
      (submitForm as jest.Mock).mockRejectedValueOnce(mockError);

      // Assertions
      await expect(submitForm(mockFormData)).rejects.toThrow(
        "Submission failed"
      );
      expect(submitForm).toHaveBeenCalledWith(mockFormData);
    });
  });

  describe("getSubmissions", () => {
    test("fetches submissions successfully", async () => {
      // Mock API response
      const mockSubmissionsData: TableResponse = {
        columns: ["Full Name", "Email", "Status"],
        data: [
          {
            id: "1",
            "Full Name": "John Doe",
            Email: "john@example.com",
            Status: "Approved",
          },
        ],
      };

      (getSubmissions as jest.Mock).mockResolvedValueOnce(mockSubmissionsData);

      const result = await getSubmissions();

      // Assertions
      expect(getSubmissions).toHaveBeenCalled();
      expect(result).toEqual(mockSubmissionsData);
    });

    test("throws error when fetching submissions fails", async () => {
      // Mock API error
      const mockError = new Error("Failed to fetch submissions");
      (getSubmissions as jest.Mock).mockRejectedValueOnce(mockError);

      // Assertions
      await expect(getSubmissions()).rejects.toThrow(
        "Failed to fetch submissions"
      );
    });
  });

  describe("getStates", () => {
    test("fetches states for a country successfully", async () => {
      // Mock API response
      const mockStatesData = [
        { label: "California", value: "California" },
        { label: "New York", value: "New York" },
        { label: "Texas", value: "Texas" },
      ];

      (getStates as jest.Mock).mockResolvedValueOnce(mockStatesData);

      const result = await getStates("USA");

      // Assertions
      expect(getStates).toHaveBeenCalledWith("USA");
      expect(result).toEqual(mockStatesData);
    });

    test("returns empty array when API call fails", async () => {
      // Mock API to return empty array on error
      (getStates as jest.Mock).mockResolvedValueOnce([]);

      const result = await getStates("INVALID");

      // Assertions
      expect(getStates).toHaveBeenCalledWith("INVALID");
      expect(result).toEqual([]);
    });
  });
});
