"use client";

import { WebStorage } from "redux-persist";

const DB_NAME = "propertyApp";
const STORE_NAME = "reduxState";
const DB_VERSION = 1;

const openDB = (): Promise<IDBDatabase> => {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.reject(new Error("IndexedDB is not available in SSR"));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const indexedDbStorage: WebStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (typeof window === "undefined") return null; // Avoid SSR execution
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onerror = () => {
          db.close();
          reject(request.error);
        };

        request.onsuccess = () => {
          db.close();
          resolve(request.result || null);
        };
      });
    } catch (err) {
      console.error("Error reading from IndexedDB:", err);
      return null;
    }
  },

  setItem: async (key: string, value: string): Promise<void> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(value, key);

        request.onerror = () => {
          db.close();
          reject(request.error);
        };

        request.onsuccess = () => {
          db.close();
          resolve();
        };
      });
    } catch (err) {
      console.error("Error writing to IndexedDB:", err);
      throw err;
    }
  },

  removeItem: async (key: string): Promise<void> => {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(key);

        request.onerror = () => {
          db.close();
          reject(request.error);
        };

        request.onsuccess = () => {
          db.close();
          resolve();
        };
      });
    } catch (err) {
      console.error("Error removing from IndexedDB:", err);
      throw err;
    }
  },
};

// Helper to check storage size
export const getStorageSize = async (): Promise<number> => {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        db.close();
        const totalSize = new Blob([JSON.stringify(request.result)]).size;
        resolve(totalSize);
      };
    });
  } catch (err) {
    console.error("Error checking storage size:", err);
    return 0;
  }
};
