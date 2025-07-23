import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

// Pages
import Home from "@/pages/Home";
import PropertySearch from "@/pages/PropertySearch";
import PropertyDetails from "@/pages/PropertyDetails";
import PropertyUpload from "@/pages/PropertyUpload";
import ValuationDashboard from "@/pages/ValuationDashboard";
import Reports from "@/pages/Reports";
import AdminDashboard from "@/pages/AdminDashboard";

// Layout
import Layout from "@/components/Layout";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<PropertySearch />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/upload" element={<PropertyUpload />} />
            <Route path="/valuation" element={<ValuationDashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" richColors />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
