import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCookie, removeCookie } from '../../../cookiesUtilis';
import { useRouter } from 'next/navigation';
import { showToast } from '@/utilis/toast/showToast';
import { logoutUser } from '@/utilis/ApiRequests';
import { Loader } from '../loader/loader';

const Header: React.FC = () => {
    const [user, setUser] = useState<{ username: string; email: string } | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    useEffect(() => {
        // Retrieve user data from cookies
        const username = getCookie('username');
        const email = getCookie('email');
        if (username && email) {
            setUser({ username, email });
        }
    }, []);

    useEffect(() => {
        const token = getCookie('token');
        if (!token) {
            router.push('/')
        }
    }, [])

    const handleLogout = async () => {
        try {
            setLoading(true);

            const response = await logoutUser();
            console.log('response', response)
            if (response.success) {
                removeCookie('username');
                removeCookie('email');
                removeCookie('token');
                router.push('/');

                showToast(response.message, "success");
            } else {
                showToast(response.message || 'Something went wrong', "error");
            }
        } catch (error) {
            console.error('Logout failed:', error);
            showToast('Error during logout', "error");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {loading && <Loader />}

            <header className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto py-4 flex justify-between items-center px-5 lg:px-0">
                    {/* Logo Section */}
                    <div className="text-white text-xl lg:text-3xl font-extrabold tracking-wide hover:text-gray-300 transition duration-300">
                        <Link href="/book-listings" className="text-white hover:text-gray-200">
                            Book Exchange Platform
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <nav className={`space-x-8 hidden md:flex text-sm lg:text-lg`}>
                        <Link
                            href="/book-listings"
                            className="text-white hover:text-blue-300 transform hover:scale-110 transition duration-300"
                        >
                            Book Listings
                        </Link>
                        <Link
                            href="/book-discovery"
                            className="text-white hover:text-blue-300 transform hover:scale-110 transition duration-300"
                        >
                            Book Discovery
                        </Link>
                        <Link
                            href="/matchmaking"
                            className="text-white hover:text-blue-300 transform hover:scale-110 transition duration-300"
                        >
                            Matchmaking
                        </Link>
                        <Link
                            href="/exchange-requests"
                            className="text-white hover:text-blue-300 transform hover:scale-110 transition duration-300"
                        >
                            Exchange Requests
                        </Link>
                        {user ? (
                            <div className="relative">
                                <button
                                    className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center focus:outline-none"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {/* Display first letter of username */}
                                    <span className="text-xl font-bold text-gray-700 mt-1">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50">
                                        <div className="px-4 py-3">
                                            <p className="text-sm font-medium text-gray-700 capitalize">
                                                {user.username}
                                            </p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <div className="border-t border-gray-200" />
                                        <button
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/"
                                className="text-white hover:text-blue-300 transform hover:scale-110 transition duration-300"
                            >
                                Login
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center space-x-4">
                        <button
                            className="text-white text-2xl focus:outline-none"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            ☰
                        </button>
                        {mobileMenuOpen && (
                            <div className="absolute top-20 left-[-20px] w-full bg-white shadow-lg z-50">
                                <nav className="flex flex-col p-4 space-y-4">
                                    <Link href="/book-listings" className="text-gray-800 hover:text-blue-500">
                                        Book Listings
                                    </Link>
                                    <Link href="/book-discovery" className="text-gray-800 hover:text-blue-500">
                                        Book Discovery
                                    </Link>
                                    <Link href="/matchmaking" className="text-gray-800 hover:text-blue-500">
                                        Matchmaking
                                    </Link>
                                    <Link href="/exchange-requests" className="text-gray-800 hover:text-blue-500">
                                        Exchange Requests
                                    </Link>
                                    {user ? (
                                        <>
                                            <p className="text-gray-800">
                                                {user.username} - {user.email}
                                            </p>
                                            <button
                                                className="text-left text-gray-800 hover:text-red-500"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link href="/login" className="text-gray-800 hover:text-blue-500">
                                            Login
                                        </Link>
                                    )}
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
