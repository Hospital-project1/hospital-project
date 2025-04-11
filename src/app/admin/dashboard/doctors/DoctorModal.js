// src/app/dashboard/doctors/DoctorModal.js
import { useState, useEffect } from 'react';

export default function DoctorModal({ isOpen, onClose, mode, doctor, onSubmit, onDelete }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    specialty: '',
    details: '',
    profilePicture: '',
    availability: []
  });
  
  const [availabilityInput, setAvailabilityInput] = useState({
    day: '',
    from: '',
    to: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const specialties = ["Orthopedist", "Internist", "Dermatologist", "ENT Doctor", "doctor"];
  const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  
  // تحديث البيانات عند تغيير الطبيب المختار
  useEffect(() => {
    if (doctor && (mode === 'edit' || mode === 'delete')) {
      setFormData({
        name: doctor.user.name || '',
        email: doctor.user.email || '',
        password: '', // نحتاج فقط كلمة المرور للإضافة
        phone: doctor.user.phone || '',
        address: doctor.user.address || '',
        specialty: doctor.specialty || '',
        details: doctor.details || '',
        profilePicture: doctor.user.profilePicture || '',
        availability: doctor.availability || []
      });
    } else {
      // إعادة تعيين النموذج عند الإضافة
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        specialty: '',
        details: '',
        profilePicture: '',
        availability: []
      });
    }
    
    // إعادة تعيين الأخطاء
    setErrors({});
  }, [doctor, mode]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // مسح خطأ هذا الحقل
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setAvailabilityInput(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addAvailability = () => {
    // التحقق من إدخال بيانات الوقت
    if (!availabilityInput.day || !availabilityInput.from || !availabilityInput.to) {
      return;
    }
    
    // إضافة وقت عمل جديد
    setFormData(prev => ({
      ...prev,
      availability: [
        ...prev.availability,
        { ...availabilityInput }
      ]
    }));
    
    // إعادة تعيين حقول الإدخال
    setAvailabilityInput({
      day: '',
      from: '',
      to: ''
    });
  };
  
  const removeAvailability = (index) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // التحقق من الحقول المطلوبة
    if (!formData.name) newErrors.name = 'الاسم مطلوب';
    if (!formData.email) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (mode === 'add' && !formData.password) newErrors.password = 'كلمة المرور مطلوبة للإضافة';
    if (!formData.specialty) newErrors.specialty = 'التخصص مطلوب';
    
    // التحقق من صحة البريد الإلكتروني
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صالح';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // إذا كنا نقوم بالتعديل وكلمة المرور فارغة، لا نرسلها
    const dataToSubmit = { ...formData };
    if (mode === 'edit' && !dataToSubmit.password) {
      delete dataToSubmit.password;
    }
    
    onSubmit(dataToSubmit, mode === 'edit');
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          {/* رأس النافذة */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-[#1D1F27]">
              {mode === 'add' && 'إضافة طبيب جديد'}
              {mode === 'edit' && 'تعديل بيانات الطبيب'}
              {mode === 'delete' && 'حذف الطبيب'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* نموذج الإضافة/التعديل */}
          {(mode === 'add' || mode === 'edit') && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* المعلومات الأساسية */}
                <div>
                  <h3 className="text-md font-medium mb-4 text-[#1D1F27] pb-2 border-b">المعلومات الأساسية</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#1D1F27] mb-1">الاسم الكامل*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#1D1F27] mb-1">البريد الإلكتروني*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                      dir="ltr"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#1D1F27] mb-1">
                      {mode === 'edit' ? 'كلمة المرور (اتركها فارغة للإبقاء على كلمة المرور الحالية)' : 'كلمة المرور*'}
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                      dir="ltr"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#1D1F27] mb-1">رقم الهاتف</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      dir="ltr"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#1D1F27] mb-1">العنوان</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#1D1F27] mb-1">رابط الصورة الشخصية</label>
                    <input
                      type="text"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded"
                      dir="ltr"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                {/* معلومات الطبيب */}
                <div>
                  <h3 className="text-md font-medium mb-4 text-[#1D1F27] pb-2 border-b">معلومات الطبيب</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#1D1F27] mb-1">التخصص*</label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className={`w-full p-2 border rounded ${errors.specialty ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">اختر التخصص</option>
                      {specialties.map(specialty => (
                        <option key={specialty} value={specialty}>
                          {specialty}
                        </option>
                      ))}
                    </select>
                    {errors.specialty && <p className="text-red-500 text-xs mt-1">{errors.specialty}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#1D1F27] mb-1">نبذة عن الطبيب</label>
                    <textarea
                      name="details"
                      value={formData.details}
                      onChange={handleChange}
                      rows="3"
                      className="w-full p-2 border border-gray-300 rounded"
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#1D1F27] mb-1">أوقات العمل</label>
                    
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <select
                        name="day"
                        value={availabilityInput.day}
                        onChange={handleAvailabilityChange}
                        className="p-2 border border-gray-300 rounded text-sm"
                      >
                        <option value="">اليوم</option>
                        {daysOfWeek.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      
                      <input
                        type="time"
                        name="from"
                        value={availabilityInput.from}
                        onChange={handleAvailabilityChange}
                        className="p-2 border border-gray-300 rounded text-sm"
                        placeholder="من"
                      />
                      
                      <input
                        type="time"
                        name="to"
                        value={availabilityInput.to}
                        onChange={handleAvailabilityChange}
                        className="p-2 border border-gray-300 rounded text-sm"
                        placeholder="إلى"
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={addAvailability}
                      className="bg-[#0CB8B6] text-white px-2 py-1 rounded text-sm"
                    >
                      إضافة وقت
                    </button>
                    
                    {/* عرض أوقات العمل المضافة */}
                    {formData.availability.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <h4 className="text-sm font-medium text-[#1D1F27]">أوقات العمل المضافة:</h4>
                        <div className="max-h-36 overflow-y-auto">
                          {formData.availability.map((slot, index) => (
                            <div 
                              key={index} 
                              className="flex justify-between items-center bg-gray-50 p-2 rounded mb-1 text-sm"
                            >
                              <span>
                                {slot.day}: <span dir="ltr">{slot.from} - {slot.to}</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => removeAvailability(index)}
                                className="text-[#CE592C] hover:text-red-600"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#DDDFDE] hover:bg-gray-300 text-[#1D1F27] px-4 py-2 rounded transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-[#0CB8B6] hover:bg-[#0a9e9c] text-white px-4 py-2 rounded transition"
                >
                  {mode === 'add' ? 'إضافة طبيب' : 'حفظ التغييرات'}
                </button>
              </div>
            </form>
          )}
          
          {/* نافذة تأكيد الحذف */}
          {mode === 'delete' && doctor && (
            <div className="text-center py-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#CE592C] mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              
              <p className="text-lg mb-6">
                هل أنت متأكد من رغبتك في حذف الطبيب <span className="font-bold">{doctor.user.name}</span>؟
              </p>
              
              <p className="text-sm text-gray-500 mb-6">
                سيتم حذف جميع بيانات هذا الطبيب. هذا الإجراء لا يمكن التراجع عنه.
              </p>
              
              <div className="flex justify-center space-x-4 rtl:space-x-reverse">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#DDDFDE] hover:bg-gray-300 text-[#1D1F27] px-4 py-2 rounded transition"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="bg-[#CE592C] hover:bg-red-600 text-white px-4 py-2 rounded transition"
                >
                  تأكيد الحذف
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}