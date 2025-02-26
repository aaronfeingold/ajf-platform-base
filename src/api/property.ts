import type { PropertyRecordCard } from "@/types/property";
import api, { handleApiResponse } from "@/lib/axios";
import type {
  GetPropertyRecordCardsListResponse,
  GetAllPropertyRecordCards,
} from "@/api/types";
import { PROPERTY_RECORD_CARDS } from "@/api/endpoints";
import { PaginationParams } from "@/api/types";

export const getPropertyRecordCards = async ({
  pageSize = 1000,
  page = 1,
}: PaginationParams = {}): Promise<GetPropertyRecordCardsListResponse> => {
  return handleApiResponse(
    api.get(PROPERTY_RECORD_CARDS, {
      params: {
        page_size: pageSize,
        page,
      },
    })
  );
};

// note: total number is between 3500 and 4000
export const getAllPropertyRecordCards = async (
  pageSize = 500
): Promise<GetAllPropertyRecordCards> => {
  const data = [];
  let page = 1;
  let count = 0;

  while (true) {
    const response = await getPropertyRecordCards({
      pageSize,
      page,
    });
    // after first iteration, count will be set
    if (!count) count = response.count;
    data.push(...response.results);

    if (!response.next) break;
    page++;
  }

  return {
    count,
    data,
    lastFetched: Date.now(),
  };
};

export const getPropertyRecordCardById = async (
  id: number
): Promise<PropertyRecordCard> => {
  return handleApiResponse(api.get(`${PROPERTY_RECORD_CARDS}${id}`));
};
