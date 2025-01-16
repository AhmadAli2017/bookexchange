export const BASE_URL = process.env.URL || "http://localhost:8000";

export const API_ENDPOINTS = {
    NEW_USER_REGISTER: '/api/auth/register',
    LOGOUT:"/api/auth/logout",
    LOGIN:"/api/auth/login",
    BOOKS:"/api/books",
    MATCHMAKING_EXCHANGE_REQUEST:"/api/books/matchmaking/exchange-request",
    EXCHANGE_REQUEST:"/api/books/matchmaking",
    EXCHANGE_REQUEST_ACTION:"/api/books/exchange-request"



};
