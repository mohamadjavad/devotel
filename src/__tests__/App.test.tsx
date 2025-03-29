import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";

// Mock the components used in the App
jest.mock("../components/InsuranceFormPage", () => ({
  InsuranceFormPage: () => (
    <div data-testid="insurance-form-page">Insurance Form Page</div>
  ),
}));

jest.mock("../components/ApplicationsListPage", () => ({
  ApplicationsListPage: () => (
    <div data-testid="applications-list-page">Applications List Page</div>
  ),
}));

jest.mock("../components/Layout", () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">
      <div data-testid="layout-content">{children}</div>
    </div>
  ),
}));

// Mock react-query
jest.mock("@tanstack/react-query", () => ({
  QueryClient: jest.fn().mockImplementation(() => ({
    // Mock any methods that might be used
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
}));

// Override the BrowserRouter mock from setupTests for this specific test
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    ...originalModule,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="browser-router">{children}</div>
    ),
  };
});

// Mock the window.location.pathname
const mockLocationAssign = jest.fn();
Object.defineProperty(window, "location", {
  value: {
    pathname: "/",
    assign: mockLocationAssign,
  },
  writable: true,
});

describe("App Component", () => {
  test("renders the Layout component with wrapped content", () => {
    render(<App />);

    // Layout should be present
    expect(screen.getByTestId("layout")).toBeInTheDocument();

    // QueryClientProvider should be present (React Query setup)
    expect(screen.getByTestId("query-client-provider")).toBeInTheDocument();

    // BrowserRouter should be present (routing setup)
    expect(screen.getByTestId("browser-router")).toBeInTheDocument();
  });

  // Note: Complete route testing would require more complex setup with memory router
  // These tests verify the structure and provider setup of the App
});

describe("App Routing", () => {
  test("redirects to /new-application by default", () => {
    // Manually set the window.location.pathname to "/"
    Object.defineProperty(window, "location", {
      value: { pathname: "/" },
      writable: true,
    });

    render(<App />);

    // Should render the Navigate component to redirect
    expect(screen.getByTestId("navigate")).toBeInTheDocument();
  });

  test("renders InsuranceFormPage at /new-application route", () => {
    // Manually set the window.location.pathname to "/new-application"
    Object.defineProperty(window, "location", {
      value: { pathname: "/new-application" },
      writable: true,
    });

    // This is a partial test since we can't fully test routing without MemoryRouter
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // InsuranceFormPage should be rendered
    expect(screen.getByTestId("insurance-form-page")).toBeInTheDocument();
  });

  test("renders ApplicationsListPage at /my-applications route", () => {
    // Manually set the window.location.pathname to "/my-applications"
    Object.defineProperty(window, "location", {
      value: { pathname: "/my-applications" },
      writable: true,
    });

    // This is a partial test since we can't fully test routing without MemoryRouter
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // ApplicationsListPage should be rendered
    expect(screen.getByTestId("applications-list-page")).toBeInTheDocument();
  });
});
