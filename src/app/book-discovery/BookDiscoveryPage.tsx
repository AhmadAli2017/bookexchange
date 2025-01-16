'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react';
import { API_ENDPOINTS, BASE_URL } from '@/utilis/apiEndpoints';
import { getCookie } from '../../../cookiesUtilis';
import { Loader } from '@/components/loader/loader';

const BookDiscoveryPage: React.FC = () => {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    genre: '',
    author: '',
    title: '',
  });

  const token = getCookie('token');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.BOOKS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success === true) {
        console.log('response.data.data', response.data.data)
        setBooks(response.data.data);
        setLoading(false);
      } else {
        console.error('Error fetching books:', response.data.message);
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch books', err);
      setLoading(false);
    }
  };

  // Fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books based on selected filters
  const filteredBooks = books.filter((book) => {
    return (
      (filters.genre === '' || book.genre.toLowerCase() === filters.genre.toLowerCase()) &&
      (filters.author === '' || book.author.toLowerCase().includes(filters.author.toLowerCase())) &&
      (filters.title === '' || book.title.toLowerCase().includes(filters.title.toLowerCase()))
    );
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFilters({ ...filters, [id]: value });
  };

  console.log('books', books)

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
              <input
                type="text"
                id="title"
                value={filters.title}
                onChange={handleFilterChange}
                placeholder="Search by Title"
                className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
              <input
                type="text"
                id="author"
                value={filters.author}
                onChange={handleFilterChange}
                placeholder="Search by Author"
                className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
              <select
                id="genre"
                value={filters.genre}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border rounded-md focus:ring-primary focus:outline-none"
              >
                <option value="">Select Genre</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Dystopian">Dystopian</option>
                <option value="Classic">Classic</option>
              </select>
            </div>
          </div>

          {/* Book Listings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {loading ? (
              <p className="col-span-full text-center text-lg text-gray-500">Loading books...</p>
            ) : filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-white p-6 rounded-lg shadow-lg border hover:shadow-xl transition transform hover:scale-105"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h2 className="text-xl font-bold text-gray-700">{book.title}</h2>
                  <p className="text-gray-600">Author: {book.author}</p>
                  <p className="text-gray-500">Genre: {book.genre}</p>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-lg text-gray-500">
                No books found matching your criteria.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDiscoveryPage;
