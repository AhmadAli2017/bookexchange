'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '../../../cookiesUtilis';
import { Loader } from '@/components/loader/loader';
import { API_ENDPOINTS, BASE_URL } from '@/utilis/apiEndpoints';

const ExchangeRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);  // Use 'any' for flexibility in this example.
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = getCookie('token');

  // Function to fetch exchange requests from API

  const fetchExchangeRequests = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}${API_ENDPOINTS.EXCHANGE_REQUEST}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRequests(response.data.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch exchange requests.');
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchExchangeRequests();
  }, [token]);

  const handleRequestAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      const response = await axios.put(
        `${BASE_URL}${API_ENDPOINTS.EXCHANGE_REQUEST_ACTION}/${id}`,

        { action },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // If the request is successful, update the status locally
      const updatedRequests = requests.map((request) => {
        if (request._id === id) {
          request.status = action === 'accept' ? 'Accepted' : 'Rejected';
        }
        return request;
      });
      setRequests(updatedRequests);
      fetchExchangeRequests()
    } catch (error) {
      setError('Failed to update exchange request status.');
    }
  };

  return (
    <>
      {loading && <Loader />}

      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {requests.length > 0 ? (
              requests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition"
                >
                  <div className="relative mb-4">
                    <img
                      src={request.bookId?.image || '/assets/images/default-book.jpg'}
                      alt={request.bookId?.title}
                      className="w-full h-64 object-cover rounded-md"
                    />
                    <div className="absolute top-0 left-0 p-2 bg-opacity-50 bg-black text-white rounded-tl-md">
                      <p className="text-lg font-bold">{request.bookId?.title}</p>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-gray-700">
                    Exchange Request for "{request.bookId?.title}"
                  </h2>
                  <p className="text-gray-600">Requested by: {request.sender}</p>
                  <p className="text-gray-500">Book Owner: {request.receiver}</p>
                  <p className="text-gray-400">Status: {request.status}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleRequestAction(request._id, 'accept')}
                          className="px-4 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(request._id, 'reject')}
                          className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status !== 'pending' && (
                      <button
                        disabled
                        className="px-4 py-2 text-sm bg-gray-500 text-white rounded-md"
                      >
                        {request.status === 'Accepted' ? 'Request Accepted' : 'Request Rejected'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-center text-lg text-gray-500">No requests found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ExchangeRequestsPage;
