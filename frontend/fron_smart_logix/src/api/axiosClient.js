// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
    // Asumiendo que tu API Gateway o backend corre en el puerto 8080
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;