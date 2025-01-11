'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

type FormData = {
  name: string;
  email: string;
};

const CTAPopup = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [formData, setFormData] = useState<FormData>({ name: '', email: '' });

  // Close popup on Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveData = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/saveCtaData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert('Data saved successfully!');
        setFormData({ name: '', email: '' });
      } else {
        const errorData = await response.json();
        alert(`Failed to save data: ${errorData.message}`);
      }
    } catch (error) {
      alert('An error occurred while saving data.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative rounded-lg border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 top-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
          aria-label="Close popup"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Subscribe to Our Newsletter
        </h2>
        <p className="mt-2 text-lg text-primary-600 dark:text-primary-400">
          Stay updated with the latest posts and insights.
        </p>
        <form onSubmit={saveData} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200">
              Email
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                required
              />
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-primary-500 px-4 py-2 font-bold text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:bg-primary-400"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

export default CTAPopup;
