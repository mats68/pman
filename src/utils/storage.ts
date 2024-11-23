// src/utils/storage.ts

import { decryptData, encryptData } from "./encryption";

// Speichert Daten in localStorage
export const saveToStorage = (key: string, data: any, secrectKey: string) => {
  if (data && data.length > 0) {
    const encryptedData = encryptData(data, secrectKey);
    localStorage.setItem(key, encryptedData);
  }
};

// Lädt Daten aus localStorage
export const loadFromStorage = (key: string, secrectKey: string): any => {
  let decryptedData = null;
  const encryptedData = localStorage.getItem(key);
  if (encryptedData) {
    decryptedData = decryptData(encryptedData, secrectKey);
  }
  return decryptedData;
};
