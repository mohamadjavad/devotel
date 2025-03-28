import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ApplicationsListPage } from "./components/ApplicationsListPage";
import { InsuranceFormPage } from "./components/InsuranceFormPage";
import { Layout } from "./components/Layout";
import { CountryStateForm } from "./examples/CountryStateForm";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/new-application" element={<InsuranceFormPage />} />
            <Route path="/my-applications" element={<ApplicationsListPage />} />
            <Route
              path="/examples/country-state"
              element={<CountryStateForm />}
            />
            <Route
              path="/"
              element={<Navigate to="/new-application" replace />}
            />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
