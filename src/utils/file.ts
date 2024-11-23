import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import { path } from "@tauri-apps/api";

// Speichert Daten in einer Datei
export const saveToFile = async (filename: string, data: any) => {
  const programDir = await path.appLocalDataDir();
  // const programDir = await appDir();
  const fn = `${programDir}\\${filename}`;
  alert("Speichere Datei in:" + fn);
  try {
    await writeTextFile(fn,JSON.stringify(data));
    
  } catch (error) {
    alert("Fehler beim Speichern der Datei:" + error);
    
  }
};

export const loadFromFile = async (filename: string) => {
  try {
    const programDir = await path.appLocalDataDir();
    const fn = `${programDir}\\${filename}`;
    const content = await readTextFile(fn);
    return JSON.parse(content);
  } catch (error) {
    console.error("Fehler beim Laden der Datei:", error);
    return null;
  }
};