# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

# Devotel Insurance Application

A modern web application for managing insurance applications with multi-language support, form autosave, and dynamic forms.

## Features

- 🌐 Multi-language support (English, Farsi) with RTL layout support
- 📝 Dynamic form generation based on server configurations
- 💾 Form autosave functionality
- 📱 Responsive design for all devices
- 🧪 Comprehensive test suite using React Testing Library

## Tech Stack

- React 19 with TypeScript
- Material UI 7.0
- React Query for data fetching
- Formik and Yup for form management and validation
- i18next for internationalization
- React Router for navigation
- Vite for fast development and bundling
- Jest and React Testing Library for testing

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone [repository-url]
   cd devotel
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   VITE_API_BASE_URL=https://assignment.devotel.io/api
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Testing

The project uses Jest and React Testing Library for testing. The tests focus on user interactions and component behavior rather than implementation details.

### Running Tests

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:coverage
```

Run a specific test file:

```bash
npm test -- src/components/__tests__/LanguageSelector.test.tsx
```

### Test Structure

- `src/__tests__/`: Application-level tests
- `src/components/__tests__/`: Component-specific tests
- `src/hooks/__tests__/`: Custom hooks tests
- `src/services/__tests__/`: API service tests
- `src/__mocks__/`: Mock files for testing

### Testing Approach

The tests follow these principles:

1. **Component Testing**: Each component has its own test file focusing on its functionality
2. **Custom Hook Testing**: Hooks are tested with the `renderHook` utility to verify their behavior
3. **Service Testing**: API services are tested by mocking external dependencies
4. **User-Centric Testing**: Tests simulate real user interactions
5. **Isolation**: Components are isolated using mocks for dependencies
6. **Coverage**: Tests cover success and error cases

### Test Examples

#### Component Rendering Tests

```tsx
test("renders form structure when loaded", () => {
  render(<DynamicForm formStructure={mockFormStructure} isLoading={false} />);

  // Form title should be visible
  expect(screen.getByText("Test Form")).toBeInTheDocument();

  // Form fields should be rendered
  expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
});
```

#### User Interaction Tests

```tsx
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
```

#### Custom Hook Tests

```tsx
test("returns current language from hook", () => {
  // Mock the i18n hook to return 'en' as the language
  (useTranslation as jest.Mock).mockReturnValue({
    i18n: {
      language: "en",
      changeLanguage: mockChangeLanguage,
    },
    t: (key: string) => key,
  });

  const { result } = renderHook(() => useLanguage());

  expect(result.current.currentLanguage).toBe("en");
  expect(result.current.isRTL).toBe(false);
});
```

#### API Service Tests

```tsx
test("fetches submissions successfully", async () => {
  // Mock API response
  const mockSubmissionsData = {
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
```

### Testing Catalog

#### Hooks Tested

- **useLanguage**: Tests language selection, RTL detection, and translation functionality
- **useFormStructure**: Tests form structure fetching, error handling, and form selection
- **useDynamicForm**: Tests form initialization, submission, autosave functionality, and field visibility
- **useSubmissions**: Tests submissions fetching, filtering, sorting, and pagination

#### API Services Tested

- **getFormStructure**: Tests retrieving form structures with/without specific form type
- **submitForm**: Tests form submission success and error handling
- **getSubmissions**: Tests fetching submissions data and error handling
- **getStates**: Tests fetching states for a country and handling invalid responses

These tests ensure that all key functionalities of the application are verified, providing confidence that the app will work correctly for users.

## Project Structure

```
src/
├── __mocks__/          # Mock files for testing
├── __tests__/          # Application-level tests
├── components/         # React components
│   └── __tests__/      # Component tests
├── hooks/              # Custom React hooks
│   └── __tests__/      # Hook tests
├── services/           # API services
│   └── __tests__/      # Service tests
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
├── index.css           # Global styles
├── main.tsx            # Application entry point
└── setupTests.ts       # Test setup
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License.
