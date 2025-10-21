'use client';
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Calendar } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function Contact() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    courseInterest: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  // Check URL params to show Calendly by default
  useEffect(() => {
    const bookParam = searchParams?.get('book');
    if (bookParam === 'true') {
      setShowCalendly(true);
    }
  }, [searchParams]);

  // Load Calendly script
  useEffect(() => {
    if (showCalendly) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showCalendly]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          country: '',
          courseInterest: '',
          message: '',
        });
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" className="py-20 lg:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Your <span className="text-cyan-400">Australian Journey?</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-600">
            Book a free consultation with our MARA-registered agents. We speak your language and understand your aspirations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form / Calendly */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border-2 border-gray-100">
              {/* Toggle Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setShowCalendly(false)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    !showCalendly
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Mail className="w-5 h-5" />
                  Contact Form
                </button>
                <button
                  onClick={() => setShowCalendly(true)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    showCalendly
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </button>
              </div>

              {!showCalendly ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-8">Send Us a Message</h3>
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Nepal, India, etc."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>

                    {/* Course Interest */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Interest
                      </label>
                      <input
                        type="text"
                        name="courseInterest"
                        value={formData.courseInterest}
                        onChange={handleChange}
                        placeholder="MBA, Engineering, IT, etc."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Tell us about your goals and any questions you have..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Book Free Consultation'}
                    </button>
                    <button
                      type="button"
                      className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold border-2 border-green-600 hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp Us
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                </div>
              )}
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Consultation</h3>
                  <p className="text-gray-600 mb-6">
                    Choose a convenient time for your free consultation with our MARA-registered agents.
                  </p>
                  {/* Calendly inline widget */}
                  <div 
                    className="calendly-inline-widget" 
                    data-url="https://calendly.com/studyandvisa-au" 
                    style={{ minWidth: '320px', height: '700px' }}
                  />
                </>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Sydney Office */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
              <h4 className="text-lg font-bold text-blue-600 mb-4">Sydney, Australia</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Level 15, 123 Pitt Street, Sydney NSW 2000</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span>+61 2 9876 5432</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span>sydney@studyandvisa.com</span>
                </div>
              </div>
            </div>

            {/* Kathmandu Office */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
              <h4 className="text-lg font-bold text-blue-600 mb-4">Kathmandu, Nepal</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>Durbar Marg, Kathmandu 44600</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span>+977 1 234 5678</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <span>kathmandu@studyandvisa.com</span>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-600" />
                <h4 className="text-lg font-bold text-gray-900">Business Hours</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold">Closed</span>
                </div>
                <p className="text-xs text-gray-500 mt-3">* Times shown in AEST (Australian Eastern Standard Time)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
