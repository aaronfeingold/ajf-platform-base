import api, { handleApiResponse } from "@/app/api/axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { camelizeKeys, decamelizeKeys } from "humps";
import { handleRouteError } from "@/app/api/util";
import { REPORT_REQUESTS } from "@/app/api/endpoints";
import type { GetReportRequestListResponse } from "@/types/api";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pageSize = parseInt(url.searchParams.get("pageSize") ?? "1000");
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const response = await handleApiResponse<
      Promise<GetReportRequestListResponse>
    >(
      api.get(REPORT_REQUESTS, {
        params: {
          page_size: pageSize, // Make sure backend expects snake_case
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

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const requestData = decamelizeKeys(body);
    const response = await handleApiResponse<
      Promise<GetReportRequestListResponse>
    >(
      api.get(REPORT_REQUESTS, {
        data: requestData,
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

export async function PATCH(request: NextRequest) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Report request ID is required" },
        { status: 400 }
      );
    }

    const requestData = decamelizeKeys(updateData);

    const response = await handleApiResponse(
      api.patch(`${REPORT_REQUESTS}/${id}`, {
        data: requestData,
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
