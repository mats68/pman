import CryptoJS from "crypto-js";

// Daten verschlüsseln
export const encryptData = (data: any, key: string): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
};

// Daten entschlüsseln
export const decryptData = (cipherText: string, key: string): any => {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  if (!decrypted) {
    throw new Error("Entschlüsselung fehlgeschlagen: Falscher Schlüssel");
  }
  return JSON.parse(decrypted);
};
