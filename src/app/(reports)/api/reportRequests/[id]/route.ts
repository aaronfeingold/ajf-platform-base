import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { camelizeKeys } from "humps";
import api, { handleApiResponse } from "@/app/api/axios";
import { handleRouteError } from "@/app/api/util";
import { REPORT_REQUESTS } from "@/app/api/endpoints";

// GET handler for fetching a specific report request by ID
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const slug = pathParts[pathParts.length - 1];

    const response = await handleApiResponse(
      api.get(`${REPORT_REQUESTS}/${slug}`, {
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
