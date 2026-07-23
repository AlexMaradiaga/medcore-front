import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

if (!SECRET_KEY) {
    throw new Error('No se encontró la variable de entorno VITE_ENCRYPTION_KEY.');
}

const IV_LENGTH = 16;

export const CryptoService = {

    encrypt(text: string): string {
        const iv = CryptoJS.lib.WordArray.random(IV_LENGTH);

        // Forzamos el parseo correcto de la llave en UTF-8
        const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);

        const encrypted = CryptoJS.AES.encrypt(
            text,
            key,
            {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        // encrypted.toString() devuelve el cipherText automáticamente en Base64
        return `${iv.toString()}:${encrypted.toString()}`;
    },

    decrypt(cipherText: string): string {
        if (!cipherText) {
            throw new Error('El texto cifrado está vacío.');
        }

        const parts = cipherText.split(':');

        if (parts.length !== 2) {
            throw new Error('Formato de texto cifrado inválido.');
        }

        const ivHex = parts[0]!;
        const encryptedData = parts[1]!;

        const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);

        const decrypted = CryptoJS.AES.decrypt(
            encryptedData,
            key,
            {
                iv: CryptoJS.enc.Hex.parse(ivHex),
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            }
        );

        const result = decrypted.toString(CryptoJS.enc.Utf8);

        if (!result) {
            throw new Error(
                'No fue posible desencriptar el contenido. Verifique la clave o el payload.'
            );
        }

        return result;
    }
};
