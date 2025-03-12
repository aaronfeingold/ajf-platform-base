"use client";

import { withAuth } from "@/hooks/useProtectedRoute";
import CreateReportRequestPage from "@/components/Reports/CreateReportRequestPage";

function Page() {
  return <CreateReportRequestPage />;
}

export default withAuth(Page);
