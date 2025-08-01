'use client';
import { Modal } from 'antd';
import { useState } from 'react';

interface AIPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => void;
  title?: string;
  description?: string;
  placeholder?: string;
}

const AIAgentIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="32"
      cy="32"
      r="30"
      fill="#F9FAFB"
      stroke="#6366F1"
      strokeWidth="3"
    />
    <circle cx="32" cy="22" r="8" fill="#6366F1" />
    <path d="M22 42c0-5.5 4.5-10 10-10s10 4.5 10 10v6H22v-6z" fill="#6366F1" />
    <circle cx="26" cy="16" r="1.5" fill="white" />
    <circle cx="38" cy="16" r="1.5" fill="white" />
    <circle cx="32" cy="12" r="1.5" fill="white" />
    <path
      d="M44 36c2 0 4 2 4 4s-2 4-4 4h-4v-3"
      stroke="#6366F1"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="14"
      y1="22"
      x2="24"
      y2="22"
      stroke="#818CF8"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="14" cy="22" r="2" fill="#818CF8" />
    <line
      x1="40"
      y1="22"
      x2="50"
      y2="22"
      stroke="#818CF8"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="50" cy="22" r="2" fill="#818CF8" />
  </svg>
);

export const AIPopup = ({
  visible,
  onClose,
  onSubmit,
  title = 'AI Course Creator',
  description = 'Describe the course you want to create. Our AI will research and generate comprehensive content based on your description.',
  placeholder = 'e.g., "Create an advanced React course with TypeScript and modern state management"',
}: AIPopupProps) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(prompt);
      setPrompt('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <AIAgentIcon />
          <span className="text-xl font-bold text-gray-900">{title}</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      className="font-sans"
      styles={{
        header: { borderBottom: '1px solid #F3F4F6', padding: '20px 24px' },
        body: { padding: '24px' },
        content: { borderRadius: '12px', overflow: 'hidden' },
      }}
    >
      <div className="space-y-6">
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <p className="text-indigo-800 font-medium text-sm">
            <span className="font-semibold">Note:</span> Our AI will analyze the
            latest trends and resources to create up-to-date course content.
          </p>
        </div>

        <p className="text-gray-600 text-base leading-6">{description}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              className="w-full border border-gray-200 rounded-xl p-4 pr-14 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-gray-700 placeholder-gray-400 resize-none"
              rows={5}
              autoFocus
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className={`absolute right-3 bottom-3 p-2 rounded-xl ${
                !prompt.trim() || isLoading
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 transition-colors'
              }`}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
