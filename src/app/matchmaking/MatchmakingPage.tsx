'use client';
import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios, { AxiosError } from 'axios';
import { API_ENDPOINTS, BASE_URL } from '@/utilis/apiEndpoints';
import { getCookie } from '../../../cookiesUtilis';
import { Loader } from '@/components/loader/loader';
import { showToast } from '@/utilis/toast/showToast';

const MatchmakingPage: React.FC = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<{
        title: string;
        owner: string;
        _id: string;
        user: any; // Include the 'user' object
    } | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const token = getCookie('token');
    const userId = getCookie('userId');

    // Fetch books from API
    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.BOOKS}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setBooks(response.data.data); // Store fetched books in state
            } else {
                console.error('Failed to fetch books:', response.data.message);
            }
        } catch (err) {
            console.error('Failed to fetch books', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // Open modal to initiate exchange request
    const handleExchangeRequest = (book: { title: string; owner: string; _id: string; user: any }) => {
        console.log('Selected Book:', book); // Log the complete book object

        // Set the selected book with the full user object included
        setSelectedBook({
            title: book.title,
            owner: book.user.email, // The owner info from the user object
            _id: book._id, // The _id from the book
            user: book.user, // Store the user object too
        });

        setIsModalOpen(true); // Open the modal for exchange request
    };



    // Close modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBook(null);
    };

    // Send exchange request API call


    const sendExchangeRequest = async () => {
        if (!selectedBook) return;
        setLoading(true);

        console.log("Selected book:", selectedBook); // Add this line for debugging

        const { _id, user } = selectedBook; // Extract the book ID and user info
        const receiverId = user._id; // Extract receiverId from the user object

        const exchangeData = {
            bookId: _id,
            senderId: userId, // The sender ID is fetched from the cookies
            receiverId: receiverId, // Set receiverId from the selected book's user
        };
        console.log('exchangeData', exchangeData);

        try {
            const response = await axios.post(
                `${BASE_URL}${API_ENDPOINTS.MATCHMAKING_EXCHANGE_REQUEST}`,
                exchangeData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                showToast(response.data.message, "success");
                fetchBooks(); // Refresh the book list after successful request
                setErrorMessage('');
                handleCloseModal();
                setLoading(false);
            } else {
                setErrorMessage(response.data.message || 'Failed to send exchange request.');
                setLoading(false);
                showToast(response.data.message, "error");
            }
        } catch (err) {
            const error = err as AxiosError;

            if (error.response) {
                const errorMessage = (error.response.data as { message: string }).message;
                console.log('Error response:', error.response);
                setLoading(false);
                setErrorMessage(errorMessage || 'An error occurred while sending the request.');
            } else {
                console.log('Error:', error.message);
                setLoading(false);
                setErrorMessage('An error occurred while sending the request.');
            }
            setSuccessMessage('');
        }
    };



    useEffect(() => {
        console.log('Selected Book:', selectedBook); // Log the selectedBook whenever it changes
    }, [selectedBook]);




    return (
        <>
            {loading && <Loader />}

            <div className="min-h-screen bg-gray-100 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Matches Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {loading ? (
                            <p className="col-span-full text-center text-lg text-gray-500">Loading books...</p>
                        ) : books.length > 0 ? (
                            books
                                .filter((book) => book.user._id !== userId)
                                .map((book) => {
                                    console.log('book', book);
                                    const hasRequests = book.exchangeRequests && book.exchangeRequests.length > 0;
                                    const pendingRequest = hasRequests && book.exchangeRequests.some((req: any) => req.status === 'pending');
                                    const acceptedRequest = hasRequests && book.exchangeRequests.some((req: any) => req.status === 'Accepted');
                                    const rejectedRequest = hasRequests && book.exchangeRequests.some((req: any) => req.status === 'Rejected');

                                    return (
                                        <div
                                            key={book._id}
                                            className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-xl transition transform hover:scale-105"
                                        >
                                            <img
                                                src={book.image}
                                                alt={book.title}
                                                className="w-full h-56 object-cover rounded-md mb-4"
                                            />
                                            <h2 className="text-xl font-semibold text-gray-700">{book.title}</h2>
                                            <p className="text-gray-600">Author: {book.author}</p>
                                            <p className="text-gray-500">Genre: {book.genre}</p>

                                            {hasRequests ? (
                                                pendingRequest ? (
                                                    <button className="mt-4 px-4 py-2 text-sm bg-yellow-500 text-white rounded-md" disabled>
                                                        Request Pending
                                                    </button>
                                                ) : acceptedRequest ? (
                                                    <button className="mt-4 px-4 py-2 text-sm bg-green-500 text-white rounded-md" disabled>
                                                        Request Accepted
                                                    </button>
                                                ) : rejectedRequest ? (
                                                    <button className="mt-4 px-4 py-2 text-sm bg-red-500 text-white rounded-md" disabled>
                                                        Request Rejected
                                                    </button>
                                                ) : null
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        handleExchangeRequest({
                                                            title: book.title,
                                                            owner: book.user.email,
                                                            _id: book._id,
                                                            user: book.user,
                                                        })
                                                    }
                                                    className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
                                                >
                                                    Send Exchange Request
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                        ) : (
                            <p className="col-span-full text-center text-lg text-gray-500">No books found.</p>
                        )}

                    </div>
                </div>

                {/* Modal for Exchange Request */}
                {selectedBook && (
                    <>
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50"
                            onClick={handleCloseModal}
                        />
                        <Dialog open={isModalOpen} onClose={handleCloseModal}>
                            <div className="fixed inset-0 flex items-center justify-center">
                                <Dialog.Panel className="bg-white w-96 p-6 rounded-lg shadow-lg">
                                    <h2 className="text-2xl font-semibold text-gray-800">Initiate Exchange Request</h2>
                                    <p className="text-gray-600 mt-2">
                                        You are about to send an exchange request for the book "{selectedBook.title}" to {selectedBook.owner}.
                                    </p>
                                    {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
                                    {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
                                    <div className="mt-6 flex justify-end space-x-4">
                                        <button
                                            onClick={handleCloseModal}
                                            className="px-6 py-3 text-sm bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300 transform hover:scale-105"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={sendExchangeRequest}
                                            className="px-6 py-3 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 transform hover:scale-105"
                                        >
                                            Send Request
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </Dialog>
                    </>
                )}
            </div>
        </>
    );
};

export default MatchmakingPage;
