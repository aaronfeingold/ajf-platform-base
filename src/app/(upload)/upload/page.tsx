"use client";

import PropertyUpload from "@/components/PropertyUpload/PropertyUploadPage";
import { withAuth } from "@/hooks/useProtectedRoute";

function ClientPropertyUpload() {
  return <PropertyUpload />;
}

export default withAuth(ClientPropertyUpload);
