import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { path } from "@tauri-apps/api";
import { decryptData, encryptData } from './encryption';

// Speichert Daten in einer Datei
export const saveToFile = async (filename: string, data: any, key: string) => {
  if (data && data.length > 0) { 
    const encryptedData = encryptData(data, key);
    const programDir = await path.appLocalDataDir();
    const fn = `${programDir}\\${filename}`;
    try {
      await writeTextFile(fn,encryptedData);
      
    } catch (error) {
      console.error("Fehler beim Speichern der Datei:", error);
    }
  }
};

export const loadFromFile = async (filename: string, key: string) => {
  try {
    const programDir = await path.appLocalDataDir();
    const fn = `${programDir}\\${filename}`;
    const encryptedData = await readTextFile(fn);
    const decryptedData = decryptData(encryptedData, key);
    return decryptedData;
  } catch (error) {
    console.error("Fehler beim Laden der Datei:", error);
    return null;
  }
};