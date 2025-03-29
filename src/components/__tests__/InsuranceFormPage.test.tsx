import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useFormStructure } from "../../hooks/useFormStructure";
import { useLanguage } from "../../hooks/useLanguage";
import { InsuranceFormPage } from "../InsuranceFormPage";

// Mock the hooks
jest.mock("../../hooks/useLanguage");
jest.mock("../../hooks/useFormStructure");
jest.mock("../DynamicForm", () => ({
  DynamicForm: jest.fn(({ onSubmitSuccess }) => {
    return (
      <div data-testid="dynamic-form">
        <button
          data-testid="mock-submit-btn"
          onClick={() =>
            onSubmitSuccess && onSubmitSuccess({ success: true, id: "123" })
          }
        >
          Mock Submit
        </button>
      </div>
    );
  }),
}));

describe("InsuranceFormPage Component", () => {
  // Mock form structures for testing
  const mockFormStructures = [
    {
      formId: "health-insurance",
      title: "Health Insurance",
    },
    {
      formId: "car-insurance",
      title: "Car Insurance",
    },
  ];

  // Mock implementations
  const mockGetSelectedFormStructure = jest.fn((id) => {
    return (
      mockFormStructures.find((form) => form.formId === id) ||
      mockFormStructures[0]
    );
  });

  const mockUseLanguageReturn = {
    t: (key: string) => {
      const translations: Record<string, string> = {
        "messages.noFormStructure": "No form structure available",
        "messages.submissionSuccess":
          "Your application has been submitted successfully!",
        "form.titles.health-insurance": "Health Insurance",
        "form.titles.car-insurance": "Car Insurance",
      };
      return translations[key] || key;
    },
    currentLanguage: "en",
    changeLanguage: jest.fn(),
    isRTL: false,
  };

  beforeEach(() => {
    (useLanguage as jest.Mock).mockReturnValue(mockUseLanguageReturn);
    (useFormStructure as jest.Mock).mockReturnValue({
      formStructures: mockFormStructures,
      getSelectedFormStructure: mockGetSelectedFormStructure,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading spinner when form structures are loading", () => {
    (useFormStructure as jest.Mock).mockReturnValue({
      formStructures: [],
      getSelectedFormStructure: mockGetSelectedFormStructure,
      isLoading: true,
    });

    render(<InsuranceFormPage />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders warning when no form structures are available", () => {
    (useFormStructure as jest.Mock).mockReturnValue({
      formStructures: [],
      getSelectedFormStructure: mockGetSelectedFormStructure,
      isLoading: false,
    });

    render(<InsuranceFormPage />);

    expect(screen.getByText("No form structure available")).toBeInTheDocument();
  });

  test("renders form tabs when form structures are available", () => {
    render(<InsuranceFormPage />);

    // Check if tabs are rendered
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByText("Health Insurance")).toBeInTheDocument();
    expect(screen.getByText("Car Insurance")).toBeInTheDocument();

    // By default, first tab should be selected
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Health Insurance"
    );
  });

  test("changes selected tab when a different tab is clicked", () => {
    render(<InsuranceFormPage />);

    // Click on the second tab
    const carInsuranceTab = screen.getByText("Car Insurance");
    fireEvent.click(carInsuranceTab);

    // The Car Insurance tab should now be selected
    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Car Insurance"
    );

    // The getSelectedFormStructure should be called with the new form ID
    expect(mockGetSelectedFormStructure).toHaveBeenCalledWith("car-insurance");
  });

  test("shows success message after form submission", async () => {
    render(<InsuranceFormPage />);

    // Initially, success message should not be visible
    expect(
      screen.queryByText("Your application has been submitted successfully!")
    ).not.toBeInTheDocument();

    // Trigger form submission by clicking the mock submit button
    const submitButton = screen.getByTestId("mock-submit-btn");
    fireEvent.click(submitButton);

    // Success message should now be visible
    await waitFor(() => {
      expect(
        screen.getByText("Your application has been submitted successfully!")
      ).toBeInTheDocument();
    });
  });

  test("resets success message when switching form types", async () => {
    render(<InsuranceFormPage />);

    // Submit the form to show success message
    const submitButton = screen.getByTestId("mock-submit-btn");
    fireEvent.click(submitButton);

    // Success message should be visible
    await waitFor(() => {
      expect(
        screen.getByText("Your application has been submitted successfully!")
      ).toBeInTheDocument();
    });

    // Switch to a different tab
    const carInsuranceTab = screen.getByText("Car Insurance");
    fireEvent.click(carInsuranceTab);

    // Success message should be hidden
    expect(
      screen.queryByText("Your application has been submitted successfully!")
    ).not.toBeInTheDocument();
  });
});
