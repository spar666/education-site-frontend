'use client';

import { fetchAllFaq } from 'apps/student/app/api/FAQ';
import { Minus, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface IFaq {
  id: string;
  question: string;
  answer: string;
}

const FaqSection = () => {
  const [faqData, setFaqData] = useState<IFaq[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFaq() {
      setLoading(true);
      try {
        const response = await fetchAllFaq();
        setFaqData(response?.data?.data || []);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchFaq();
  }, []);

  return (
    <section className="py-20 px-4">
      <div className="mx-auto">
        <h2 className="text-3xl font-bold text-blue-900  mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600  mb-12">
          Here are some of the most common questions we receive. Feel free to
          reach out if you need further assistance!
        </p>

        {loading ? (
          <p className="text-center text-gray-600">Loading FAQs...</p>
        ) : (
          <div className="space-y-4">
            {faqData.length > 0 ? (
              faqData.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg shadow-md">
                  <button
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-all"
                    onClick={() =>
                      setOpenFaq(openFaq === faq.id ? null : faq.id)
                    }
                    aria-expanded={openFaq === faq.id}
                  >
                    <span className="text-lg font-medium text-blue-900">
                      {faq.question}
                    </span>
                    {openFaq === faq.id ? (
                      <Minus className="h-5 w-5 text-blue-900" />
                    ) : (
                      <Plus className="h-5 w-5 text-blue-900" />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <div className="p-4 bg-gray-50 rounded-b-lg">
                      <div
                        className="text-gray-600 text-base leading-relaxed mt-2"
                        dangerouslySetInnerHTML={{
                          __html: faq?.answer || '',
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No FAQs available at the moment.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqSection;
