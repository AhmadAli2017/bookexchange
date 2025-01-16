'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import axios from 'axios';
import { API_ENDPOINTS, BASE_URL } from '@/utilis/apiEndpoints';
import { useRouter } from 'next/navigation';
import { getCookie } from '../../../cookiesUtilis';
import { showToast } from '@/utilis/toast/showToast';
import { Loader } from '@/components/loader/loader';
interface Book {
  _id: number;
  title: string;
  author: string;
  genre: string;
  image: File | null;
}
const BookListingPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBook, setNewBook] = useState<Book>({
    _id: 0,
    title: '',
    author: '',
    genre: '',
    image: null,
  }); const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const token = getCookie('token');
  const userId = getCookie('userId');

  // Fetch books from the API
  const fetchBooks = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.BOOKS}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
        },
      });
      if (response.data.success == true) {
        setBooks(response.data.data); // Assuming API returns an array of books
        setLoading(false)
      } else {
        showToast(response.data.message, "error")
      }


    } catch (err) {
      console.error('Failed to fetch books', err);
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewBook({ ...newBook, [id]: value });
    setError('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBook({ ...newBook, image: file });
    }
  };

  const openEditModal = (book: any) => {
    setNewBook(book);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const resetModal = () => {
    setNewBook({ _id: 0, title: '', author: '', genre: '', image: null });
    setIsModalOpen(false);
    setIsEditing(false);
    setError('');
  };


  const saveBook = async () => {
    if (!newBook.title || !newBook.author || !newBook.genre || !newBook.image) {
      setError('All fields are required!');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', newBook.title);
      formData.append('author', newBook.author);
      formData.append('genre', newBook.genre);
      formData.append('Image', newBook.image);

      let response;

      if (isEditing) {
        console.log('isEditing working');
        response = await axios.put(
          `${BASE_URL}${API_ENDPOINTS.BOOKS}/${newBook._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        response = await axios.post(
          `${BASE_URL}${API_ENDPOINTS.BOOKS}/create`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        setBooks([...books, response.data.data]);
        resetModal();
        fetchBooks();
        showToast(response.data.message || 'Book saved successfully', 'success');
      } else {
        showToast(response.data.message || 'Something went wrong', 'error');
      }
    } catch (error: unknown) {
      console.error('Error saving book:', error);

      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.message) {
          showToast(error.response.data.message, 'error');
        } else {
          showToast('An error occurred while saving the book', 'error');
        }
      } else {
        showToast('An unexpected error occurred', 'error');
      }
    } finally {
      setLoading(false);
    }
  };




  const deleteBook = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${BASE_URL}${API_ENDPOINTS.BOOKS}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setBooks(books.filter((book) => book._id !== id));
        showToast(response?.data?.message, 'success');
        fetchBooks();
      } else {
        setError('Error deleting book');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      setError('An error occurred while deleting the book');
    } finally {
      setLoading(false);
    }
  };
  console.log("newBook.image", newBook.image);

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">Book Listings</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow-lg hover:bg-indigo-700 transition"
            >
              Add Book
            </button>
          </div>

          {/* Book Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {books?.map((book) => {
              console.log('book?.user?.userId ',book)
              return <div
                key={book?._id}
                className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-xl transition transform hover:scale-105"
              >
                <img src={book?.image} alt={book?.title} className="w-full h-56 object-cover rounded-md mb-4" />
                <h2 className="text-xl font-semibold text-gray-800">{book?.title}</h2>
                <p className="text-gray-600 mt-1">By {book?.author}</p>
                <p className="text-gray-500 text-sm">{book?.genre}</p>

                {book?.user?._id == userId &&
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() => openEditModal(book)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBook(book?._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                }

              </div>
            })}
          </div>

          {/* Modal */}
          {isModalOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={resetModal}
              />
              <Dialog open={isModalOpen} onClose={resetModal}>
                <div className="fixed inset-0 flex items-center justify-center">
                  <Dialog.Panel className="bg-white w-96 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                      {isEditing ? 'Edit Book' : 'Add a New Book'}
                    </h2>
                    <div className="space-y-4">
                      <input
                        id="title"
                        type="text"
                        value={newBook.title}
                        onChange={handleInputChange}
                        placeholder="Book Title"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                      />
                      <input
                        id="author"
                        type="text"
                        value={newBook.author}
                        onChange={handleInputChange}
                        placeholder="Author"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                      />
                      <select
                        id="genre"
                        value={newBook.genre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="" disabled>
                          Select Genre
                        </option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Dystopian">Dystopian</option>
                        <option value="Classic">Classic</option>
                      </select>
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                      />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      {newBook.image && (
                        <img
                          src={
                            newBook.image instanceof File
                              ? URL.createObjectURL(newBook.image)
                              //@ts-ignore
                              : newBook.image.startsWith('http')
                                ? newBook.image
                                : `${BASE_URL}/books/${newBook.image}`
                          }
                          alt="Book Preview"
                          className="w-full h-56 object-cover rounded-md mt-4"
                        />
                      )}



                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={resetModal}
                          className="px-4 py-2 text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveBook}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                          {isEditing ? 'Save Changes' : 'Add Book'}
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </div>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default BookListingPage;
