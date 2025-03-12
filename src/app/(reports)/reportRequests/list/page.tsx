"use client";

import { withAuth } from "@/hooks/useProtectedRoute";
import ReportRequestListPage from "@/components/Reports/ReportRequestListPage";

function Page() {
  return <ReportRequestListPage />;
}

export default withAuth(Page);
