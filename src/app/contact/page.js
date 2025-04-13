import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact Us | Healthcare Clinic",
  description: "Reach out to us for inquiries, appointments, or feedback.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10 text-blue-800">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-blue-700">
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mt-1 mr-3 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Address</h3>
                  <p className="text-gray-600">
                    King Abdullah Street, Amman, Jordan
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-3 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Phone</h3>
                  <p className="text-gray-600">+962 6 123 4567</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-3 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <p className="text-gray-600">info@healthcareclinic.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="mt-1 mr-3 text-blue-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Working Hours</h3>
                  <p className="text-gray-600">
                    Saturday - Thursday: 9:00 AM - 9:00 PM
                  </p>
                  <p className="text-gray-600">Friday: Closed</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-2xl font-semibold mb-5 text-blue-700">
                Our Location
              </h2>
              <div className="bg-gray-100 h-64 w-full rounded-lg overflow-hidden shadow-sm">
                {/* Replace this with an actual map using Google Maps or any other map service */}
                <div className="w-full h-full flex items-center justify-center bg-blue-50">
                  <p className="text-gray-500">Location Map</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6 text-blue-700">
              Send Us a Message
            </h2>
            <ContactForm />
          </div>
        </div>

        <div className="mt-12 bg-blue-50 p-8 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-blue-700">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800">
                How can I book an appointment?
              </h3>
              <p className="text-gray-600 mt-2">
                You can book an appointment by phone or through our website's
                appointment page.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800">
                Can I cancel my appointment?
              </h3>
              <p className="text-gray-600 mt-2">
                Yes, you can cancel your appointment at least 24 hours before
                the scheduled time.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm">
              <h3 className="font-medium text-gray-800">
                Do you accept health insurance?
              </h3>
              <p className="text-gray-600 mt-2">
                Yes, we work with most health insurance companies. Please
                contact us to verify coverage with your specific provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
