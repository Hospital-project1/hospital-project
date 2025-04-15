"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/contact");
      setMessages(response.data.data);
      setError(null);
    } catch (err) {
      setError("Failed to load messages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/contact/${id}`, { isRead: true });
      setMessages(
        messages.map((msg) => (msg._id === id ? { ...msg, isRead: true } : msg))
      );
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (err) {
      setError("Failed to update message status");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const openMessage = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message._id);
    }
  };

  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const getShortDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen" dir="ltr">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {unreadCount} unread / {messages.length} total
            </span>
            <button
              onClick={fetchMessages}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              title="Refresh messages"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Message List - Now on the left */}
          <div className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full bg-gray-50 rounded-lg py-2 pl-10 pr-4 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="w-4 h-4 text-gray-400 absolute left-3 top-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
            </div>

            <div className="h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6 text-center">
                  <svg
                    className="w-12 h-12 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <p>No messages yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {messages.map((message) => (
                    <li
                      key={message._id}
                      onClick={() => openMessage(message)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedMessage && selectedMessage._id === message._id
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      } ${!message.isRead ? "bg-blue-50/30" : ""}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 uppercase font-medium ${
                            !message.isRead ? "ring-2 ring-blue-400" : ""
                          }`}
                        >
                          {message.name.substring(0, 1)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <p className="font-medium text-gray-900 truncate">
                              {message.name}
                              {!message.isRead && (
                                <span className="inline-block ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                              )}
                            </p>
                            <span className="text-xs text-gray-500">
                              {getShortDate(message.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {message.subject}
                          </p>
                          <p className="text-xs text-gray-400 truncate mt-1">
                            {message.message.substring(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Message Content - Now on the right */}
          <div className="md:w-2/3 bg-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            {selectedMessage ? (
              <>
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center space-x-2">
                      {!selectedMessage.isRead && (
                        <button
                          onClick={() => markAsRead(selectedMessage._id)}
                          className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          Mark as Read
                        </button>
                      )}
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          selectedMessage.isRead
                            ? "bg-gray-100 text-gray-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {selectedMessage.isRead ? "Read" : "New"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 uppercase font-medium">
                      {selectedMessage.name.substring(0, 1)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedMessage.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedMessage.email}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(selectedMessage.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-grow overflow-auto bg-gray-50">
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="prose max-w-none whitespace-pre-line text-gray-700">
                      {selectedMessage.message}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-white">
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        (window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`)
                      }
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        ></path>
                      </svg>
                      Reply
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                        ></path>
                      </svg>
                      Archive
                    </button>
                    <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors ml-auto">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-10 text-center text-gray-400">
                <svg
                  className="w-16 h-16 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  ></path>
                </svg>
                <h3 className="text-xl font-medium text-gray-500 mb-2">
                  No message selected
                </h3>
                <p className="text-gray-400">
                  Select a message from the list to view its contents
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}