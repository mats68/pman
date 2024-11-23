import CryptoJS from "crypto-js";

export const encryptData = (data: string, masterPassword: string): string => {
  const jsonData = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonData, masterPassword).toString();
};

export const decryptData = (encryptedData: string, masterPassword: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, masterPassword);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
