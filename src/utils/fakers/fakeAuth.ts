import { faker } from "@faker-js/faker";

// Function to generate a fake JWT token
export function generateFakeJWT() {
  return faker.string.alphanumeric(128); // Generates a fake 128-character JWT
}

// Simulated login function
export function fakeLogin(username: string, password: string) {
  return new Promise<{ access: string; refresh: string }>((resolve, reject) => {
    setTimeout(() => {
      if (username === "username" && password === "password") {
        resolve({
          access: generateFakeJWT(),
          refresh: generateFakeJWT(),
        });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000); // Simulate network delay
  });
}
