import { fireEvent, render, screen } from "@testing-library/react";
import { useLanguage } from "../../hooks/useLanguage";
import { LanguageSelector } from "../LanguageSelector";

// Mock the useLanguage hook
jest.mock("../../hooks/useLanguage", () => ({
  useLanguage: jest.fn(),
}));

describe("LanguageSelector Component", () => {
  const mockChangeLanguage = jest.fn();

  beforeEach(() => {
    // Default mock implementation
    (useLanguage as jest.Mock).mockReturnValue({
      currentLanguage: "en",
      changeLanguage: mockChangeLanguage,
      t: (key: string) => {
        // Simple translation mock
        const translations: Record<string, string> = {
          "languageSelector.english": "English",
          "languageSelector.farsi": "Farsi",
        };
        return translations[key] || key;
      },
      isRTL: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders language selector with English selected by default", () => {
    render(<LanguageSelector />);

    // The Select component should show the current language value
    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();
    expect(selectElement).toHaveTextContent("English");
  });

  test("changes language when a different option is selected", () => {
    render(<LanguageSelector />);

    // Open the dropdown
    const selectElement = screen.getByRole("combobox");
    fireEvent.mouseDown(selectElement);

    // Select Farsi option
    const farsiOption = screen.getByText("Farsi");
    fireEvent.click(farsiOption);

    // Check if changeLanguage was called with the correct language code
    expect(mockChangeLanguage).toHaveBeenCalledWith("fa");
  });

  test("displays RTL language correctly when current language is Farsi", () => {
    // Mock the hook to return Farsi as current language
    (useLanguage as jest.Mock).mockReturnValue({
      currentLanguage: "fa",
      changeLanguage: mockChangeLanguage,
      t: (key: string) => {
        const translations: Record<string, string> = {
          "languageSelector.english": "English",
          "languageSelector.farsi": "Farsi",
        };
        return translations[key] || key;
      },
      isRTL: true,
    });

    render(<LanguageSelector />);

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toHaveTextContent("Farsi");
  });
});
