import axios from 'axios';
const api = axios.create({timeout :2000,
    baseUrl : "http://localhost:8000",
});

export default api;