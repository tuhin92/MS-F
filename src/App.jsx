import React, { useState } from "react";
import { Send, Check, X } from "lucide-react";

const App = () => {
  const [emailDetails, setEmailDetails] = useState({
    to: "",
    subject: "",
    text: "",
  });
  const [status, setStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailDetails({
      ...emailDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("http://localhost:3010/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailDetails),
      });

      if (!response.ok) throw new Error("Failed to send email");
      const data = await response.json();

      setStatus({ message: data.message, success: true });
      setEmailDetails({ to: "", subject: "", text: "" });
      setShowModal(true);
    } catch (error) {
      setStatus({ message: error.message, success: false });
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setStatus(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-blue-500 text-white p-6 text-center">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Send className="w-8 h-8" />
            Email Sender
          </h1>
          <p>With personal SMTP mail server</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              id="to"
              name="to"
              value={emailDetails.to}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={emailDetails.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
              placeholder="Email Subject"
            />
          </div>

          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="text"
              name="text"
              value={emailDetails.text}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out resize-none"
              placeholder="Write your message here..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Send Email
          </button>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center relative">
            <button 
              onClick={closeModal} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <X className="w-6 h-6" />
            </button>
            
            {status?.success ? (
              <div>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  Email Sent!
                </h2>
                <p className="text-gray-600">
                  Your email has been sent successfully.
                </p>
              </div>
            ) : (
              <div>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <X className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                  Error
                </h2>
                <p className="text-gray-600">
                  {status?.message || "Failed to send email"}
                </p>
              </div>
            )}

            <button
              onClick={closeModal}
              className="mt-6 w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;