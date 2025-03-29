import { useQuery } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { useFormStructure } from "../useFormStructure";

// Mock dependencies
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("../../services/api", () => ({
  getFormStructure: jest.fn(),
}));

describe("useFormStructure Hook", () => {
  // Mock form structure data
  const mockFormStructures = [
    {
      formId: "health-insurance",
      title: "Health Insurance",
      fields: [
        { id: "name", type: "text", label: "Full Name", required: true },
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns loading state when fetching form structures", async () => {
    // Mock useQuery to return loading state
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useFormStructure());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.formStructures).toEqual([]);
  });

  test("returns form structures when fetched successfully", async () => {
    // Mock useQuery to return successful data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockFormStructures,
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useFormStructure());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.formStructures).toEqual(mockFormStructures);
  });

  test("getSelectedFormStructure returns correct form structure", async () => {
    // Mock useQuery to return successful data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockFormStructures,
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useFormStructure());

    // Get form structure by ID
    const formStructure =
      result.current.getSelectedFormStructure("car-insurance");
    expect(formStructure).toEqual(mockFormStructures[1]);
  });

  test("getSelectedFormStructure returns first form structure when ID not specified", async () => {
    // Mock useQuery to return successful data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockFormStructures,
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useFormStructure());

    // Get default form structure
    const formStructure = result.current.getSelectedFormStructure();
    expect(formStructure).toEqual(mockFormStructures[0]);
  });

  test("getSelectedFormStructure returns undefined for non-existent ID", async () => {
    // Mock useQuery to return successful data
    (useQuery as jest.Mock).mockReturnValue({
      data: mockFormStructures,
      isLoading: false,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useFormStructure());

    // Get non-existent form structure
    const formStructure =
      result.current.getSelectedFormStructure("non-existent-id");
    expect(formStructure).toBeUndefined();
  });

  test("returns empty array when there is an error", async () => {
    // Mock useQuery to return error state
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch"),
    });

    const { result } = renderHook(() => useFormStructure());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.formStructures).toEqual([]);
  });
});
