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

# Devotel Insurance Portal

An insurance application portal that allows users to apply for different types of insurance and view their submissions.

## Overview

This application supports:

- Dynamic form rendering based on form structure from the API
- Country-state relationship handling that fetches states based on selected country
- Form validation with real-time feedback
- Submission management with sorting, filtering, and pagination
- Responsive design using Material UI

## API Response Format

The submissions API returns data in the following format:

```json
{
  "columns": ["Full Name", "Age", "Gender", "Insurance Type", "City"],
  "data": [
    {
      "id": "1",
      "Full Name": "John Doe",
      "Age": 28,
      "Gender": "Male",
      "Insurance Type": "Health",
      "City": "New York"
    },
    {
      "id": "2",
      "Full Name": "Jane Smith",
      "Age": 32,
      "Gender": "Female",
      "Insurance Type": "Home",
      "City": "Los Angeles"
    }
  ]
}
```

## Client-Side Data Handling

The application implements client-side:

- Pagination
- Sorting
- Filtering
- Column visibility control

This provides a responsive user experience without requiring multiple API calls.

## Environment Variables

The application uses environment variables to configure different settings:

- `VITE_API_BASE_URL`: The base URL for API requests (e.g., "https://assignment.devotel.io/api")

### Setting Up Environment Variables

1. Copy the `.env.example` file to create a new `.env` file:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and set the appropriate values for your environment.

3. For production builds, you can create a `.env.production` file with production-specific values.

Note: Environment files (`.env`, `.env.production`, etc.) are excluded from Git by default for security reasons.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (version 7 or higher)

### Installation

```bash
npm install --legacy-peer-deps
```

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

### `npm run build`

Builds the app for production to the `dist` folder.

### `npm run lint`

Runs the linter to check for code quality issues.

### `npm run preview`

Previews the production build locally.
