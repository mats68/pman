import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { path } from "@tauri-apps/api";
import { decryptData, encryptData } from './encryption';

const getFullFileName = async (fn: string): Promise<string> => {
  const programDir = await path.appLocalDataDir();
  return `${programDir}\\${fn}`
}

const FILE_NAME = "pman.json"
const FILE_NAME_CAT = "pman_cat.json"

// Speichert Daten in einer Datei
export const saveToFile = async (data: any, secretKey: string) => {
  if (data && data.length > 0) { 
    const fn = await getFullFileName(FILE_NAME);
    const encryptedData = encryptData(data, secretKey);
    try {
      await writeTextFile(fn,encryptedData);
      
    } catch (error) {
      console.error("Fehler beim Speichern der Datei:", error);
    }
  }
};

export const loadFromFile = async (key: string) => {
  try {
    const fn = await getFullFileName(FILE_NAME);
    const encryptedData = await readTextFile(fn);
    const decryptedData = decryptData(encryptedData, key);
    return decryptedData;
  } catch (error) {
    throw new Error("Fehler beim Laden der Datei:");
  }
};

export const loadCategories = async (): Promise<string[]> => {
  try {
    const fn = await getFullFileName(FILE_NAME_CAT);
    const categories = await readTextFile(fn);
    return JSON.parse(categories);
  } catch (error) {
    console.error("Fehler beim Laden der Kategorien:", error);
    return [];
  }
};
