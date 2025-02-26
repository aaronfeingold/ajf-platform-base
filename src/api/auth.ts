import api, { handleApiResponse } from "@/lib/axios";
import { TOKEN } from "@/api/endpoints";
import type { LoginResponse } from "@/api/types";

export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  return handleApiResponse(
    api.post<LoginResponse>(TOKEN, {
      username,
      password,
    })
  );
}
