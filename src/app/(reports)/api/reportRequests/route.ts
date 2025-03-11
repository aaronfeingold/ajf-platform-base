import api, { handleApiResponse } from "@/app/api/axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { camelizeKeys } from "humps";
import { handleRouteError } from "@/app/api/util";
import { REPORT_REQUESTS } from "@/app/api/endpoints";
import type { GetReportRequestListResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "1000");
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;
  console.log("authToken", authToken);
  if (!authToken) {
    throw new Error("Authentication token is missing");
  }

  try {
    const response = await handleApiResponse<
      Promise<GetReportRequestListResponse>
    >(
      api.get(REPORT_REQUESTS, {
        params: {
          pageSize,
          page,
        },
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
    );

    return NextResponse.json(camelizeKeys(response));
  } catch (error) {
    return handleRouteError(error);
  }
}
