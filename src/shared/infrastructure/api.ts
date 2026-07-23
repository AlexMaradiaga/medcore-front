import axios from 'axios';
import { CryptoService } from './crypto';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});


api.interceptors.request.use(
    (config) => {

        // Token JWT
        const token = localStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const methodsToEncrypt = ['post', 'put', 'patch'];
        const method = config.method?.toLowerCase() ?? '';

        if (
            config.data &&
            methodsToEncrypt.includes(method) &&
            !(config.data instanceof FormData)
        ) {
            try {

                const json = JSON.stringify(config.data);

                config.data = {
                    payload: CryptoService.encrypt(json)
                };

            } catch (e) {

                console.error("Error al encriptar la petición", e);

                return Promise.reject(e);

            }
        }

        return config;

    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(

    (response) => {

        if (response.data?.payload) {

            try {

                const decrypted = CryptoService.decrypt(response.data.payload);

                response.data = JSON.parse(decrypted);

            } catch (e) {

                console.error("Error desencriptando respuesta", e);

                return Promise.reject(
                    new Error("No fue posible desencriptar la respuesta del servidor.")
                );
            }

        }

        return response;

    },

    (error) => {

        if (error.response?.data) {

            try {

                if (error.response.data.payload) {

                    const decrypted = CryptoService.decrypt(
                        error.response.data.payload
                    );

                    error.response.data = JSON.parse(decrypted);

                }

            } catch (e) {
                console.error("No fue posible desencriptar el error.", e);
            }

            const backendMessage =
                error.response.data.message ||
                error.response.data.error;

            if (backendMessage) {
                return Promise.reject(new Error(backendMessage));
            }
        }

        return Promise.reject(error);

    }
);

export default api;
