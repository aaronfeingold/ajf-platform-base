"use client";

import { withAuth } from "@/hooks/useProtectedRoute";
import ViewReportSlug from "@/components/Reports/ViewReportSlug";

function Page() {
  return <ViewReportSlug />;
}

export default withAuth(Page);
