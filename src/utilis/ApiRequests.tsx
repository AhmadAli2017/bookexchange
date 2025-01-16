import axios from "axios";
import { API_ENDPOINTS, BASE_URL } from "./apiEndpoints";
import { ApiResponse } from "./types/types";
import { getCookie } from "../../cookiesUtilis";
const apiClient = axios.create({
    baseURL: process.env.URL,
    timeout: 50000,
});

export const registerUser = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
): Promise<ApiResponse> => {
    const requestData = {
        username,
        email,
        password,
        password_confirmation: confirmPassword,
    };
    console.log('API_ENDPOINTS.NEW_USER_REGISTER', API_ENDPOINTS.NEW_USER_REGISTER)
    const response = await apiClient.post(
        `${BASE_URL}${API_ENDPOINTS.NEW_USER_REGISTER}`,
        requestData,
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    return response.data;
};


export const loginUser = async (email: string, password: string): Promise<ApiResponse> => {
    try {
        const response = await axios.post(
            `${BASE_URL}${API_ENDPOINTS.LOGIN}`,
            { email, password },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};
export const logoutUser = async (): Promise<ApiResponse> => {
    const token = getCookie('token')
    console.log('getCookie:', token); // Debugging token from cookies

    const response = await apiClient.post(
        `${BASE_URL}${API_ENDPOINTS.LOGOUT}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

