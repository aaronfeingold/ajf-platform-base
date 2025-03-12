"use client";

import ReportsListPage from "@/components/Reports/ReportsListPage";
import { withAuth } from "@/hooks/useProtectedRoute";

function Page() {
  return <ReportsListPage />;
}

export default withAuth(Page);
