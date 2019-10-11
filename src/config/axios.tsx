import axios from 'axios'

const app_id = 'RcdcW9otfK7c66XZfYKVXB29'
const app_secret = 'LUTvZHfWHvxKSjQGordWAcR2'
const API = axios.create({
    baseURL: 'https://gp-server.hunger-valley.com/',
    timeout: 1000,
    headers: {
        't-app-id': app_id,
        't-app-secret': app_secret
    }
});
// Add a request interceptor
API.interceptors.request.use(function (config) {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
    }
    return config;
}, function (error) {
    console.error(error)
    return Promise.reject(error);
});

// Add a response interceptor
API.interceptors.response.use(function (response) {
    if(response.headers['x-token']){
        localStorage.setItem('token',response.headers['x-token'])
    }
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
});
export default API