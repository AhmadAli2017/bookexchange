'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '@/utilis/ApiRequests';  // Ensure you have both APIs
import { showToast } from '@/utilis/toast/showToast';
import { getCookie, setCookie } from '../../../cookiesUtilis';
import { Loader } from '../loader/loader';
import { AxiosError } from 'axios';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true); // Start with register page
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
        setErrors({ ...errors, [e.target.id]: '' }); // Clear errors on input
    };

    const validateLoginForm = () => {
        let isValid = true;
        const newErrors = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'A valid email is required.';
            isValid = false;
        }

        if (!formData.password.trim() || formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
            isValid = false;
        }

        setErrors(newErrors);
        console.log('Login form validation:', isValid);  // Debugging
        return isValid;
    };

    const validateRegisterForm = () => {
        let isValid = true;
        const newErrors = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required.';
            isValid = false;
        }

        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'A valid email is required.';
            isValid = false;
        }

        if (!formData.password.trim() || formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long.';
            isValid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
            isValid = false;
        }

        setErrors(newErrors);
        console.log('Register form validation:', isValid);  // Debugging
        return isValid;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('register working');
        if (validateRegisterForm()) {
            setLoading(true);

            try {
                const response = await registerUser(
                    formData.username,
                    formData.email,
                    formData.password,
                    formData.confirmPassword
                );

                if (response.success) {
                    const { token, user } = response.data;
                    setCookie('token', token);
                    setCookie('username', user.username);
                    setCookie('email', user.email);
                    router.push('/');
                    setIsLogin(true)
                    showToast(response.message || 'Registration successful!', "success");
                } else {
                    showToast(response.message || 'Something went wrong', "error");
                }
            } catch (error) {
                if (error instanceof AxiosError && error.response) {
                    const errorMessage = error.response.data.message || 'Error during registration';
                    showToast(errorMessage, "error");
                } else {
                    showToast('Error during registration', "error");
                }
            } finally {
                setLoading(false);
            }
        }
    };


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log(formData);  // Debugging
        if (validateLoginForm()) {
            setLoading(true);

            try {
                const response = await loginUser(formData.email, formData.password);

                if (response.success) {
                    const { token, user } = response.data;
                    setCookie('token', token);
                    setCookie('username', user.username);
                    setCookie('email', user.email);
                    setCookie('userId', user._id);
                    router.push('/book-listings');
                    showToast(response.message, "success");
                } else {
                    showToast(response.message || 'Invalid credentials', "error");
                }
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    if (error.response && error.response.data && error.response.data.message) {
                        showToast(error.response.data.message, "error");
                    } else {
                        showToast('Error during login', "error");
                    }
                } else {
                    showToast('Error during login', "error");
                }
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const token = getCookie('token');

        if (token) {
            router.push('/book-listings')
        } else {
            router.push('/')
        }
    }, [])
    return (
        <>
            {loading && <Loader />}
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
                    <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                        {isLogin ? 'Login to Your Account' : 'Create an Account'}
                    </h2>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <form className="space-y-4" onSubmit={isLogin ? handleLogin : handleRegister}>
                            {!isLogin && (
                                <div>
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <input
                                        id="username"
                                        type="text"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Enter your username"
                                        className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:outline-none ${errors.username ? 'border-red-500' : 'focus:ring-primary'}`}
                                    />
                                    {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:outline-none ${errors.email ? 'border-red-500' : 'focus:ring-primary'}`}
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:outline-none ${errors.password ? 'border-red-500' : 'focus:ring-primary'}`}
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                            </div>
                            {!isLogin && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm your password"
                                        className={`w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:outline-none ${errors.confirmPassword ? 'border-red-500' : 'focus:ring-primary'}`}
                                    />
                                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
                            >
                                {isLogin ? 'Login' : 'Sign Up'}
                            </button>
                            {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage}</p>}
                        </form>
                    </motion.div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-blue-500 hover:text-blue-600"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;
