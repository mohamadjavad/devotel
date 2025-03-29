import { useQuery } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { TableResponse } from "../../types/form";
import { useSubmissions } from "../useSubmissions";

// Mock dependencies
jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

describe("useSubmissions Hook", () => {
  // Mock submissions data
  const mockSubmissionsData: TableResponse = {
    columns: ["Full Name", "Email", "Insurance Type", "Status"],
    data: [
      {
        id: "1",
        "Full Name": "John Doe",
        Email: "john@example.com",
        "Insurance Type": "Health",
        Status: "Approved",
      },
      {
        id: "2",
        "Full Name": "Jane Smith",
        Email: "jane@example.com",
        "Insurance Type": "Car",
        Status: "Pending",
      },
      {
        id: "3",
        "Full Name": "Bob Johnson",
        Email: "bob@example.com",
        "Insurance Type": "Home",
        Status: "Rejected",
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementation
    (useQuery as jest.Mock).mockReturnValue({
      data: mockSubmissionsData,
      isLoading: false,
      isError: false,
      error: null,
    });
  });

  test("returns loading state when fetching submissions", () => {
    // Mock loading state
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    const { result } = renderHook(() => useSubmissions());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.submissions).toEqual([]);
    expect(result.current.columns).toEqual([]);
  });

  test("returns submissions data when fetched successfully", () => {
    const { result } = renderHook(() => useSubmissions());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.submissions).toEqual(mockSubmissionsData.data);
    expect(result.current.columns).toEqual([
      {
        id: "Full Name",
        label: "Full Name",
        accessor: "Full Name",
        sortable: true,
        filterable: true,
      },
      {
        id: "Email",
        label: "Email",
        accessor: "Email",
        sortable: true,
        filterable: true,
      },
      {
        id: "Insurance Type",
        label: "Insurance Type",
        accessor: "Insurance Type",
        sortable: true,
        filterable: true,
      },
      {
        id: "Status",
        label: "Status",
        accessor: "Status",
        sortable: true,
        filterable: true,
      },
    ]);
  });

  test("filters submissions based on search term", () => {
    const { result } = renderHook(() => useSubmissions());

    // Set search term
    act(() => {
      result.current.setSearchTerm("john");
    });

    // Only John's submission should be visible
    expect(result.current.filteredSubmissions.length).toBe(1);
    expect(result.current.filteredSubmissions[0]["Full Name"]).toBe("John Doe");
  });

  test("sorts submissions by column", () => {
    const { result } = renderHook(() => useSubmissions());

    // Sort by Insurance Type in ascending order
    act(() => {
      result.current.handleSort("Insurance Type");
    });

    // Should be sorted: Car, Health, Home
    expect(result.current.filteredSubmissions[0]["Insurance Type"]).toBe("Car");
    expect(result.current.filteredSubmissions[1]["Insurance Type"]).toBe(
      "Health"
    );
    expect(result.current.filteredSubmissions[2]["Insurance Type"]).toBe(
      "Home"
    );

    // Sort again in descending order
    act(() => {
      result.current.handleSort("Insurance Type");
    });

    // Should be sorted: Home, Health, Car
    expect(result.current.filteredSubmissions[0]["Insurance Type"]).toBe(
      "Home"
    );
    expect(result.current.filteredSubmissions[1]["Insurance Type"]).toBe(
      "Health"
    );
    expect(result.current.filteredSubmissions[2]["Insurance Type"]).toBe("Car");
  });

  test("handles pagination correctly", () => {
    const { result } = renderHook(() => useSubmissions());

    // Set page size to 2
    act(() => {
      result.current.setPageSize(2);
    });

    // First page should have 2 items
    expect(result.current.paginatedSubmissions.length).toBe(2);
    expect(result.current.paginatedSubmissions[0]["Full Name"]).toBe(
      "John Doe"
    );
    expect(result.current.paginatedSubmissions[1]["Full Name"]).toBe(
      "Jane Smith"
    );

    // Go to next page
    act(() => {
      result.current.setCurrentPage(1);
    });

    // Second page should have 1 item
    expect(result.current.paginatedSubmissions.length).toBe(1);
    expect(result.current.paginatedSubmissions[0]["Full Name"]).toBe(
      "Bob Johnson"
    );
  });

  test("toggles column visibility", () => {
    const { result } = renderHook(() => useSubmissions());

    // Initially all columns should be visible
    expect(result.current.visibleColumns.length).toBe(4);

    // Hide Email column
    act(() => {
      result.current.toggleColumnVisibility("Email");
    });

    // Email column should be hidden
    expect(result.current.visibleColumns.length).toBe(3);
    expect(
      result.current.visibleColumns.find((col) => col.id === "Email")
    ).toBeUndefined();

    // Show Email column again
    act(() => {
      result.current.toggleColumnVisibility("Email");
    });

    // Email column should be visible again
    expect(result.current.visibleColumns.length).toBe(4);
    expect(
      result.current.visibleColumns.find((col) => col.id === "Email")
    ).toBeDefined();
  });

  test("returns empty arrays when there is an error", () => {
    // Mock error state
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error("Failed to fetch"),
    });

    const { result } = renderHook(() => useSubmissions());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.submissions).toEqual([]);
    expect(result.current.columns).toEqual([]);
  });
});
