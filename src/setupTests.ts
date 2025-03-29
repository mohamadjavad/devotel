// jest-dom adds custom jest matchers for asserting on DOM nodes.
// This allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import React from "react";

// Mock the i18n functionality
jest.mock("react-i18next", () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string, options?: any) => {
        if (options && options.defaultValue) {
          return options.defaultValue;
        }
        return str;
      },
      i18n: {
        changeLanguage: jest.fn(),
        language: "en",
      },
    };
  },
}));

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  BrowserRouter: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  Navigate: () => React.createElement("div", { "data-testid": "navigate" }),
  useNavigate: () => jest.fn(),
}));
