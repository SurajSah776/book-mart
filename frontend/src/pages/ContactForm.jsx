import { useState } from "react";

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
    alert("Your message has been sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <div className="min-h-screen py-[60px] flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl w-full mx-4 bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent text-center mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg text-center mb-8 font-light">
            We'd love to hear from you! Fill out the form below and we'll get
            back to you as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="group relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-500 focus:outline-none transition-all duration-200 bg-gray-50 group-hover:bg-gray-100"
                required
              />
            </div>

            <div className="group relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-500 focus:outline-none transition-all duration-200 bg-gray-50 group-hover:bg-gray-100"
                required
              />
            </div>

            <div className="group relative">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-500 focus:outline-none transition-all duration-200 bg-gray-50 group-hover:bg-gray-100"
                required
              />
            </div>

            <div className="group relative">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-gray-500 focus:outline-none transition-all duration-200 bg-gray-50 group-hover:bg-gray-100 resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white font-semibold py-4 px-6 rounded-lg transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ContactForm;
