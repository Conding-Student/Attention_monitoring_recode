// app/core/utils/encryption.ts
import CryptoJS from "crypto-js";

// Ideally, store this secret key in environment variables
const SECRET_KEY = process.env.ENCRYPTION_KEY || "default_secret_key";

export function encryptData(data: string) {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
}

export function decryptData(cipherText: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    // console.error("Decryption error:", err);
    return null;
  }
}
