"use client";

import { withAuth } from "@/hooks/useProtectedRoute";
import EditReportRequestPage from "@/components/Reports/EditReportRequestPage";

function Page() {
  return <EditReportRequestPage />;
}

export default withAuth(Page);
