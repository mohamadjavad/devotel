import { act, renderHook } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../useLanguage";

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
}));

describe("useLanguage Hook", () => {
  const mockChangeLanguage = jest.fn();

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock implementation
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: "en",
        changeLanguage: mockChangeLanguage,
      },
      t: (key: string) => key,
    });
  });

  test("returns current language", () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current.currentLanguage).toBe("en");
  });

  test("provides translation function", () => {
    const { result } = renderHook(() => useLanguage());

    expect(typeof result.current.t).toBe("function");
    expect(result.current.t("test.key")).toBe("test.key");
  });

  test("changes language when called", () => {
    const { result } = renderHook(() => useLanguage());

    act(() => {
      result.current.changeLanguage("fa");
    });

    expect(mockChangeLanguage).toHaveBeenCalledWith("fa");
  });

  test("detects RTL languages correctly", () => {
    // First test with English (LTR)
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: "en",
        changeLanguage: mockChangeLanguage,
      },
      t: (key: string) => key,
    });

    const { result, rerender } = renderHook(() => useLanguage());
    expect(result.current.isRTL).toBe(false);

    // Then test with Farsi (RTL)
    (useTranslation as jest.Mock).mockReturnValue({
      i18n: {
        language: "fa",
        changeLanguage: mockChangeLanguage,
      },
      t: (key: string) => key,
    });

    rerender();
    expect(result.current.isRTL).toBe(true);
  });
});
