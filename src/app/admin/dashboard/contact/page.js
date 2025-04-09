'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // جلب الرسائل
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/contact');
      setMessages(response.data.data);
      setError(null);
    } catch (err) {
      setError('حدث خطأ أثناء جلب الرسائل');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة القراءة
  const markAsRead = async (id) => {
    try {
      await axios.patch(`/api/contact/${id}`, { isRead: true });
      // تحديث القائمة المحلية
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, isRead: true } : msg
      ));
      // تحديث الرسالة المحددة إذا كانت هي نفسها
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (err) {
      setError('حدث خطأ أثناء تحديث حالة الرسالة');
      console.error(err);
    }
  };

  // تنفيذ عند تحميل الصفحة
  useEffect(() => {
    fetchMessages();
  }, []);

  // فتح الرسالة وتحديث حالتها
  const openMessage = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      markAsRead(message._id);
    }
  };

  // حساب عدد الرسائل غير المقروءة
  const unreadCount = messages.filter(msg => !msg.isRead).length;

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">إدارة رسائل الاتصال</h1>
      
      {/* ملخص الإحصائيات */}
      <div className="bg-white rounded-lg shadow mb-8 p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">إجمالي الرسائل</h3>
            <p className="text-2xl">{messages.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">رسائل غير مقروءة</h3>
            <p className="text-2xl">{unreadCount}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">رسائل مقروءة</h3>
            <p className="text-2xl">{messages.length - unreadCount}</p>
          </div>
          <div className="p-4 flex items-center">
            <button 
              onClick={fetchMessages}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              تحديث البيانات
            </button>
          </div>
        </div>
      </div>

      {/* عرض حالة التحميل أو الخطأ */}
      {loading && <div className="text-center py-10">جاري التحميل...</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      
      {/* عرض الرسائل */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* قائمة الرسائل */}
          <div className="md:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <h2 className="bg-gray-50 p-4 font-semibold border-b">قائمة الرسائل</h2>
            <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
              {messages.length === 0 ? (
                <div className="p-4 text-center text-gray-500">لا توجد رسائل</div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {messages.map(message => (
                    <li 
                      key={message._id} 
                      onClick={() => openMessage(message)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedMessage && selectedMessage._id === message._id ? 'bg-blue-50' : ''} ${!message.isRead ? 'font-semibold' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="truncate">{message.name}</p>
                          <p className="text-sm text-gray-500 truncate">{message.subject}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-500">{formatDate(message.createdAt)}</span>
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

          {/* تفاصيل الرسالة */}
          <div className="md:col-span-2 bg-white rounded-lg shadow">
            <h2 className="bg-gray-50 p-4 font-semibold border-b">تفاصيل الرسالة</h2>
            {selectedMessage ? (
              <div className="p-6">
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedMessage.subject}</h3>
                    <p className="text-gray-600">من: {selectedMessage.name} &lt;{selectedMessage.email}&gt;</p>
                    <p className="text-gray-500 text-sm">
                      {formatDate(selectedMessage.createdAt)}
                      {selectedMessage.isRead ? (
                        <span className="mr-2 text-green-600">• تمت القراءة</span>
                      ) : (
                        <span className="mr-2 text-blue-600">• جديد</span>
                      )}
                    </p>
                  </div>
                  {!selectedMessage.isRead && (
                    <button 
                      onClick={() => markAsRead(selectedMessage._id)}
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
                    >
                      تعليم كمقروء
                    </button>
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="whitespace-pre-line bg-gray-50 p-4 rounded">
                    {selectedMessage.message}
                  </div>
                </div>
                <div className="mt-6 flex space-x-4 space-x-reverse">
                  <button 
                    onClick={() => window.location.href = `mailto:${selectedMessage.email}?subject=رد: ${selectedMessage.subject}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm"
                  >
                    الرد عبر البريد الإلكتروني
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-gray-500">
                اختر رسالة من القائمة لعرض التفاصيل
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}