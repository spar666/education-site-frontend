'use client';
import React, { useEffect, useState } from 'react';
import { fetchAllFaq } from '../../api/FAQ';

interface IFaq {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [faqData, setFaqData] = useState<IFaq[]>([]);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null); // Track which FAQ is open

  useEffect(() => {
    async function fetchFaq() {
      setLoading(true);
      try {
        const response = await fetchAllFaq();
        setFaqData(response?.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFaq();
  }, []);

  // Toggle function for showing/hiding answers
  const toggleFAQ = (index: number) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="my-10 px-4 lg:px-0">
      <div className="max-w-screen-lg mb-10">
        <h2 className="text-3xl font-bold text-dark-blue tracking-tight mb-5">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600">
          Here are some of the most common questions we receive. Feel free to
          reach out if you need further assistance!
        </p>
      </div>

      <div className="max-w-screen-lg">
        {faqData.slice(0, 4).map((faq, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg mb-4 hover:shadow-xl transition-shadow"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {faq.question}
              </h3>
              <span className="text-2xl font-bold text-dark-blue">
                {openIndex === index ? '-' : '+'}
              </span>
            </div>
            {openIndex === index && (
              <div
                className="text-base leading-1.5 mt-3"
                dangerouslySetInnerHTML={{
                  __html: faq?.answer || '',
                }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;
