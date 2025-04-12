"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PaymentModal from "@/components/PaymentModal";
import { Loader } from "@/components/Loader";

export default function AppointmentForm({ onCancel }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    doctor: "",
    day: "",
    appointmentDate: "",
    reason: "",
    appointmentType: "clinic",
  });

  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorAvailability, setDoctorAvailability] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [createdAppointment, setCreatedAppointment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const patientRes = await axios.get("/api/auth/me", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        if (patientRes.data.success) {
          setPatientName(patientRes.data.user.name);
          setPatientId(patientRes.data.user._id);
        }

        const doctorsRes = await axios.get("/api/doctors");
        setDoctors(doctorsRes.data.doctors);
      } catch (error) {
        console.error("Failed to load initial data:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDoctorSelect = async (doctorId) => {
    if (!doctorId) {
      setSelectedDoctor(null);
      setDoctorAvailability(null);
      setFormData(prev => ({ 
        ...prev, 
        doctor: "", 
        day: "", 
        appointmentDate: "" 
      }));
      return;
    }

    try {
      setLoading(true);

      const doctor = doctors.find((d) => d._id === doctorId);
      if (doctor) {
        setSelectedDoctor(doctor);
      }

      const availabilityRes = await axios.get(
        `/api/doctors/availability?doctorId=${doctorId}`,
        { withCredentials: true }
      );
      
      if (availabilityRes.data.success) {
        setDoctorAvailability(availabilityRes.data.data);
      } else {
        throw new Error(availabilityRes.data.error || "Failed to load availability");
      }

      setFormData(prev => ({
        ...prev,
        doctor: doctorId,
        day: "",
        appointmentDate: ""
      }));
      setAvailableDates([]);
    } catch (error) {
      console.error("Failed to fetch doctor availability:", error);
      setDoctorAvailability(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }

    if (name === "day") {
      const dates = [];
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
        if (weekday === value) {
          dates.push(date.toISOString().split("T")[0]);
        }
      }
      setAvailableDates(dates);
      setFormData(prev => ({ ...prev, appointmentDate: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctor) newErrors.doctor = "Doctor is required";
    if (!formData.reason) newErrors.reason = "Reason is required";
    if (!formData.day) newErrors.day = "Day is required";
    if (!formData.appointmentType) newErrors.appointmentType = "Appointment type is required";
    if (!formData.appointmentDate) newErrors.appointmentDate = "Appointment date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const appointmentDateTime = new Date(formData.appointmentDate);

      const appointmentData = {
        doctor: formData.doctor,
        appointmentDate: appointmentDateTime,
        appointmentType: formData.appointmentType,
        day: formData.day,
        reason: formData.reason,
        amount: 15,
        currency: "JOD",
        patient: patientId,
        patientName,
        paymentStatus: "pending",
      };

      const response = await axios.post("/api/appointments", appointmentData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setCreatedAppointment(response.data.data);
      setShowPaymentModal(true);
    } catch (error) {
      console.error("Failed to create appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    try {
      await axios.post(`/api/appointments/update-status`, {
        appointmentId: createdAppointment._id,
        paymentStatus: "paid",
        paymentId: paymentData.orderID,
        paymentDetails: paymentData
      }, {
        withCredentials: true
      });
  
      router.push("/");
    } catch (error) {
      console.error("Failed to update appointment:", error);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.doctor || !formData.appointmentType) {
        validateForm();
        return;
      }
    } else if (step === 2) {
      if (!formData.day || !formData.appointmentDate) {
        validateForm();
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#0CB8B6] flex items-center justify-center text-white font-bold">
            {step}/3
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Book Your Appointment
            </h2>
            <p className="text-gray-500">
              {step === 1 && "Select your doctor and appointment type"}
              {step === 2 && "Choose your preferred date and time"}
              {step === 3 && "Provide reason for your visit"}
            </p>
          </div>
        </div>

        <div className="w-full mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-[#0CB8B6] rounded-full transition-all duration-300" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-gray-700">Patient: <span className="font-medium">{patientName}</span></p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor <span className="text-red-500">*</span>
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={(e) => handleDoctorSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0CB8B6] focus:border-transparent transition"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doc) => (
                    <option key={doc._id} value={doc._id}>
                      Dr. {doc.user.name} ({doc.specialty || "General"})
                    </option>
                  ))}
                </select>
                {errors.doctor && (
                  <p className="text-sm text-red-600 mt-1">{errors.doctor}</p>
                )}
              </div>

              {selectedDoctor && (
                <div className="bg-[#0CB8B6]/10 p-4 rounded-lg border border-[#0CB8B6]/20">
                  <h3 className="font-medium text-[#0CB8B6]">Doctor Information:</h3>
                  <p className="text-gray-700">
                    Dr. {selectedDoctor.user.name} - {selectedDoctor.specialty || "General"}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.appointmentType === "clinic" 
                        ? "border-[#0CB8B6] bg-[#0CB8B6]/5" 
                        : "border-gray-200 hover:border-[#0CB8B6]/50"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, appointmentType: "clinic" }))}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.appointmentType === "clinic" ? "border-[#0CB8B6]" : "border-gray-300"
                      }`}>
                        {formData.appointmentType === "clinic" && (
                          <div className="w-3 h-3 rounded-full bg-[#0CB8B6]"></div>
                        )}
                      </div>
                      <span className="ml-2 font-medium">Clinic Visit</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Visit the doctor at their clinic location</p>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.appointmentType === "video" 
                        ? "border-[#0CB8B6] bg-[#0CB8B6]/5" 
                        : "border-gray-200 hover:border-[#0CB8B6]/50"
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, appointmentType: "video" }))}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        formData.appointmentType === "video" ? "border-[#0CB8B6]" : "border-gray-300"
                      }`}>
                        {formData.appointmentType === "video" && (
                          <div className="w-3 h-3 rounded-full bg-[#0CB8B6]"></div>
                        )}
                      </div>
                      <span className="ml-2 font-medium">Video Consultation</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Connect with your doctor online via video call</p>
                  </div>
                </div>
                {errors.appointmentType && (
                  <p className="text-sm text-red-600 mt-1">{errors.appointmentType}</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day <span className="text-red-500">*</span>
                </label>
                <select
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0CB8B6] focus:border-transparent transition"
                  disabled={!doctorAvailability}
                >
                  <option value="">Select Day</option>
                  {doctorAvailability?.days?.map((day, i) => (
                    <option key={i} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                {errors.day && (
                  <p className="text-sm text-red-600 mt-1">{errors.day}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <select
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0CB8B6] focus:border-transparent transition"
                  disabled={!availableDates.length}
                >
                  <option value="">Select Date</option>
                  {availableDates.map((date, i) => (
                    <option key={i} value={date}>
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </option>
                  ))}
                </select>
                {errors.appointmentDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.appointmentDate}</p>
                )}
              </div>

              {formData.appointmentDate && (
                <div className="bg-[#0CB8B6]/10 p-4 rounded-lg border border-[#0CB8B6]/20">
                  <h3 className="font-medium text-[#0CB8B6]">Selected Appointment:</h3>
                  <p className="text-gray-700">
                    {new Date(formData.appointmentDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-gray-700 mt-1">
                    With Dr. {selectedDoctor?.user.name} ({formData.appointmentType === "clinic" ? "Clinic Visit" : "Video Consultation"})
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Appointment Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Patient</p>
                    <p className="font-medium">{patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">Dr. {selectedDoctor?.user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type</p>
                    <p className="font-medium">{formData.appointmentType === "clinic" ? "Clinic Visit" : "Video Consultation"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {formData.appointmentDate && new Date(formData.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Please describe your symptoms or reason for the visit..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0CB8B6] focus:border-transparent transition"
                />
                {errors.reason && (
                  <p className="text-sm text-red-600 mt-1">{errors.reason}</p>
                )}
              </div>

              <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg">
                <h3 className="text-yellow-800 font-medium">Important Note</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  By confirming this booking, you agree to pay a consultation fee of 15 JOD. 
                  Payment will be processed after booking confirmation.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-[#0CB8B6] hover:bg-[#0CB8B6]/90 text-white font-bold py-3 px-8 rounded-md inline-block transition-all"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="bg-[#CE592C] hover:bg-[#CE592C]/90 text-white font-bold py-3 px-8 rounded-md inline-block transition-all"
                disabled={loading}
              >
                Confirm Booking
              </button>
            )}
          </div>
        </form>
      </div>

      {showPaymentModal && createdAppointment && (
        <PaymentModal
          appointment={createdAppointment}
          onClose={() => setShowPaymentModal(false)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}