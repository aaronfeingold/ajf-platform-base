import { faker } from "@faker-js/faker";
import {
  indyStreets,
  indyBounds,
} from "@/utils/fakers/fakeIndianapolisLocations";
import type { PropertyRecordCard } from "@/types/property";

const generateIndyAddress = () => {
  const streetNumber = faker.number.int({ min: 1000, max: 9999 });
  const streetName = faker.helpers.arrayElement(indyStreets);
  const streetType = faker.helpers.arrayElement([
    "Street",
    "Avenue",
    "Boulevard",
    "Road",
    "Drive",
  ]);

  // Generate coordinates within Indianapolis bounds
  const latitude = faker.number.float({
    min: indyBounds.lat.min,
    max: indyBounds.lat.max,
    fractionDigits: 4,
  });

  const longitude = faker.number.float({
    min: indyBounds.lng.min,
    max: indyBounds.lng.max,
    fractionDigits: 4,
  });

  return {
    address: `${streetNumber} ${streetName} ${streetType}`,
    latitude,
    longitude,
  };
};

export const generateFakePropertyTableData = (
  count: number = 100
): PropertyRecordCard[] => {
  return Array.from({ length: count }, () => {
    const location = generateIndyAddress();
    const total_sf = faker.number.int({ min: 500, max: 5000 });
    const most_recent_valuation = faker.number.int({
      min: 100000,
      max: 1000000,
    });

    return {
      parcel_number: faker.number.int({ min: 1000000, max: 9999999 }),
      property_class_code: faker.helpers.arrayElement([
        400, 401, 402, 403, 404,
      ]),
      pretty_address: location.address,
      property_city: "Indianapolis",
      owner_name: faker.person.fullName(),
      acreage: parseFloat(faker.number.float({ min: 0.1, max: 10 }).toFixed(3)),
      total_sf,
      most_recent_valuation,
      price_per_sf: parseFloat((most_recent_valuation / total_sf).toFixed(2)),
      most_recent_ptoboa_date: faker.date
        .recent({ days: 365 })
        .toISOString()
        .split("T")[0],
      most_recent_ptoboa_amount: faker.number.int({ min: 1000, max: 50000 }),
      latitude: location.latitude,
      longitude: location.longitude,
    };
  });
};
