// import { writeTextFile, readTextFile, BaseDirectory } from "@tauri-apps/api/fs";
import { writeTextFile, readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
// const { writeTextFile, readTextFile, BaseDirectory } = window.__TAURI__.fs; 

// Speichert Daten in einer Datei
export const saveToFile = async (filename: string, data: any) => {
  await writeTextFile(
    { path: filename, contents: JSON.stringify(data) },
    { dir: BaseDirectory.App } // Speichert im App-Verzeichnis
  );
};

// Liest Daten aus einer Datei
export const loadFromFile = async (filename: string) => {
  try {
    const content = await readTextFile(
      { path: filename },
      { dir: BaseDirectory.App }
    );
    return JSON.parse(content);
  } catch (e) {
    console.error("Datei konnte nicht geladen werden:", e);
    return null;
  }
};
