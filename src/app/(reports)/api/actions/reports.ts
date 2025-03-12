import api, { handleApiResponse } from "@/app/api/axios";
import type { Report } from "@/types/report";
import { REPORTS } from "@/app/api/endpoints";

export async function getReportById(id: string): Promise<Report> {
  return handleApiResponse(api.get<Report>(`${REPORTS}${id}`));
}
// TODO: AWAITING API
// deleteReportByID()
