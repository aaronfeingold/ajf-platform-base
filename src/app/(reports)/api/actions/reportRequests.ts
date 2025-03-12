import api, { handleApiResponse } from "@/app/api/axios";
import type {
  CreateNewReportRequestData,
  UpdateReportRequestData,
} from "@/types/api";
import type { ReportRequest } from "@/types/reportRequest";
import { REPORT_REQUESTS } from "@/app/api/endpoints";

export async function getReportRequestById(id: string): Promise<ReportRequest> {
  return handleApiResponse(api.get<ReportRequest>(`${REPORT_REQUESTS}${id}`));
}

export async function createNewReportRequest(
  data: CreateNewReportRequestData
): Promise<ReportRequest> {
  return handleApiResponse(api.post<ReportRequest>(REPORT_REQUESTS, data));
}

export async function updateReportRequest(
  data: UpdateReportRequestData
): Promise<ReportRequest> {
  return handleApiResponse(api.post<ReportRequest>(REPORT_REQUESTS, data));
}

// TODO: AWAITING API
// deleteReportRequestByID()
// pollReportRequest()
// getReportRequestResults()
