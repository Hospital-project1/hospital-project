"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/contact");
      setMessages(response.data.data);
      setError(null);
    } catch (err) {
      setError("Error occurred while fetching messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Update read status
  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/contact/${id}`, { isRead: true });
      // Update local list
      setMessages(
        messages.map((msg) => (msg._id === id ? { ...msg, isRead: true } : msg))
      );
      // Update selected message if it's the same one
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (err) {
      setError("Error occurred while updating message status");
      console.error(err);
    }
  };

  // Execute on page load
  useEffect(() => {
    fetchMessages();
  }, []);

  // Open message and update its status
  const openMessage = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message._id);
    }
  };

  // Calculate unread message count
  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-gray-900 text-gray-100">
      <h1 className="text-2xl font-bold mb-6">Contact Messages Management</h1>

      {/* Statistics Summary */}
      <div className="bg-gray-800 rounded-lg shadow mb-8 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Messages</h3>
            <p className="text-2xl">{messages.length}</p>
          </div>
          <div className="bg-yellow-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Unread Messages</h3>
            <p className="text-2xl">{unreadCount}</p>
          </div>
          <div className="bg-green-900 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Read Messages</h3>
            <p className="text-2xl">{messages.length - unreadCount}</p>
          </div>
          <div className="p-4 flex items-center">
            <button
              onClick={fetchMessages}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Display loading state or error */}
      {loading && <div className="text-center py-10">Loading...</div>}
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Display messages */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Message list */}
          <div className="md:col-span-1 bg-gray-800 rounded-lg shadow overflow-hidden">
            <h2 className="bg-gray-700 p-4 font-semibold border-b border-gray-600">
              Message List
            </h2>
            <div className="overflow-y-auto" style={{ maxHeight: "600px" }}>
              {messages.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  No messages found
                </div>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {messages.map((message) => (
                    <li
                      key={message._id}
                      onClick={() => openMessage(message)}
                      className={`p-4 cursor-pointer hover:bg-gray-700 ${
                        selectedMessage && selectedMessage._id === message._id
                          ? "bg-blue-900"
                          : ""
                      } ${!message.isRead ? "font-semibold" : ""}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="truncate">{message.name}</p>
                          <p className="text-sm text-gray-400 truncate">
                            {message.subject}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-400">
                            {formatDate(message.createdAt)}
                          </span>
                          {!message.isRead && (
                            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mt-1"></span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Message details */}
          <div className="md:col-span-2 bg-gray-800 rounded-lg shadow">
            <h2 className="bg-gray-700 p-4 font-semibold border-b border-gray-600">
              Message Details
            </h2>
            {selectedMessage ? (
              <div className="p-6">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedMessage.subject}
                    </h3>
                    <p className="text-gray-300">
                      From: {selectedMessage.name} &lt;{selectedMessage.email}
                      &gt;
                    </p>
                    <p className="text-gray-400 text-sm">
                      {formatDate(selectedMessage.createdAt)}
                      {selectedMessage.isRead ? (
                        <span className="ml-2 text-green-400">• Read</span>
                      ) : (
                        <span className="ml-2 text-blue-400">• New</span>
                      )}
                    </p>
                  </div>
                  {!selectedMessage.isRead && (
                    <button
                      onClick={() => markAsRead(selectedMessage._id)}
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
                <div className="border-t border-gray-600 pt-4">
                  <div className="whitespace-pre-line bg-gray-700 p-4 rounded">
                    {selectedMessage.message}
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <button
                    onClick={() =>
                      (window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
                  >
                    Reply via Email
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-400">
                Select a message from the list to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
