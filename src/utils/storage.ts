// src/utils/storage.ts

// Speichert Daten in localStorage
export const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  // Lädt Daten aus localStorage
  export const loadFromStorage = (key: string): any => {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  };
  