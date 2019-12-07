import axios from 'axios';

const instance = axios.create({
    baseURL: '/api/v1',
    timeout: 15000,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});

export default instance;