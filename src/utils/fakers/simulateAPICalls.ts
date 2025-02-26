import type { GetAllPropertyRecordCards } from "@/api/types";
import { generateFakePropertyTableData } from "@/utils/fakers/fakeDataGenerator";

export const mockDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const simulateGetPropertyRecordCards = async (
  count: number = 100
): Promise<GetAllPropertyRecordCards> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return {
    count,
    data: generateFakePropertyTableData(count),
  };
};

export const simulatePasswordReset = async (): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // return a 'message' to simulate success
  return "Password reset email sent successfully";
};
