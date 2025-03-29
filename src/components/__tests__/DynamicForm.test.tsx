import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDynamicForm } from "../../hooks/useDynamicForm";
import { useLanguage } from "../../hooks/useLanguage";
import { FormStructure } from "../../types/form";
import { DynamicForm } from "../DynamicForm";

// Mock the hooks
jest.mock("../../hooks/useLanguage");
jest.mock("../../hooks/useDynamicForm");
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe("DynamicForm Component", () => {
  // Sample form structure for testing
  const mockFormStructure: FormStructure = {
    formId: "test-form",
    title: "Test Form",
    fields: [
      {
        id: "fullName",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "Enter your full name",
      },
      {
        id: "email",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "Enter your email address",
      },
    ],
  };

  interface MockFormikValues {
    fullName: string;
    email: string;
  }

  const mockFormikInstance = {
    values: { fullName: "", email: "" } as MockFormikValues,
    errors: {},
    touched: {},
    handleSubmit: jest.fn(),
    handleChange: jest.fn((e: { target: { name: string; value: string } }) => {
      mockFormikInstance.values[e.target.name as keyof MockFormikValues] =
        e.target.value;
    }),
    handleBlur: jest.fn(),
    setFieldValue: jest.fn((field: keyof MockFormikValues, value: string) => {
      mockFormikInstance.values[field] = value;
    }),
    setTouched: jest.fn(),
    validateForm: jest.fn(() => Promise.resolve({})),
    submitForm: jest.fn(() => Promise.resolve()),
    isValid: true,
    resetForm: jest.fn(),
  };

  const mockUseDynamicFormReturn = {
    formik: mockFormikInstance,
    visibleFormStructure: mockFormStructure,
    getFieldOptions: jest.fn(() => []),
    lastSaved: null,
    formReady: true,
    clearSavedDraft: jest.fn(),
  };

  const mockUseLanguageReturn = {
    t: (key: string, options?: { defaultValue?: string }) => {
      if (options?.defaultValue) return options.defaultValue;
      return key;
    },
    currentLanguage: "en",
    changeLanguage: jest.fn(),
    isRTL: false,
  };

  beforeEach(() => {
    // Setup mocks
    (useDynamicForm as jest.Mock).mockReturnValue(mockUseDynamicFormReturn);
    (useLanguage as jest.Mock).mockReturnValue(mockUseLanguageReturn);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading state when isLoading is true", () => {
    render(<DynamicForm formStructure={undefined} isLoading={true} />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders form structure when loaded", () => {
    render(<DynamicForm formStructure={mockFormStructure} isLoading={false} />);

    // Form title should be visible
    expect(screen.getByText("Test Form")).toBeInTheDocument();

    // Form fields should be rendered
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  test("handles form submission", async () => {
    render(
      <DynamicForm
        formStructure={mockFormStructure}
        isLoading={false}
        onSubmitSuccess={jest.fn()}
      />
    );

    // Fill out the form
    const nameInput = screen.getByLabelText(/Full Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);

    await userEvent.type(nameInput, "John Doe");
    await userEvent.type(emailInput, "john@example.com");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Validate form submission was triggered
    await waitFor(() => {
      expect(mockFormikInstance.submitForm).toHaveBeenCalled();
    });
  });

  test("shows validation errors on submit with invalid data", async () => {
    // Mock validation errors
    mockFormikInstance.validateForm.mockResolvedValueOnce({
      fullName: "Name is required",
      email: "Email is invalid",
    });

    render(<DynamicForm formStructure={mockFormStructure} isLoading={false} />);

    // Submit without filling the form
    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    // Wait for validation errors to appear
    await waitFor(() => {
      expect(mockFormikInstance.validateForm).toHaveBeenCalled();
      expect(mockFormikInstance.setTouched).toHaveBeenCalled();
    });
  });

  test("saves draft when autosave is enabled", async () => {
    render(
      <DynamicForm
        formStructure={mockFormStructure}
        isLoading={false}
        enableAutosave={true}
        draftKey="test-draft-key"
      />
    );

    // Find the save draft button
    const saveButton = screen.getByRole("button", { name: /save draft/i });
    expect(saveButton).toBeInTheDocument();

    // Click the save draft button
    fireEvent.click(saveButton);

    // Check if form submission is triggered for saving
    expect(mockFormikInstance.handleSubmit).toHaveBeenCalled();
  });

  test("allows clearing saved draft", async () => {
    render(
      <DynamicForm
        formStructure={mockFormStructure}
        isLoading={false}
        enableAutosave={true}
        draftKey="test-draft-key"
      />
    );

    // Find the clear draft button
    const clearButton = screen.getByRole("button", { name: /clear draft/i });
    expect(clearButton).toBeInTheDocument();

    // Click the clear draft button
    fireEvent.click(clearButton);

    // Expect confirmation dialog to appear
    expect(screen.getByText(/confirmation/i)).toBeInTheDocument();

    // Confirm clearing
    const confirmButton = screen.getByRole("button", { name: /confirm/i });
    fireEvent.click(confirmButton);

    // Check if clear function was called
    expect(mockUseDynamicFormReturn.clearSavedDraft).toHaveBeenCalled();
    expect(mockFormikInstance.resetForm).toHaveBeenCalled();
  });
});
