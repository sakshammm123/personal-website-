'use client';

import { useState } from 'react';

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId?: string | null;
  activityDuration?: number | null;
}

export default function ContactPopup({ isOpen, onClose, conversationId, activityDuration }: ContactPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    organisation: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors('');

    // Validation
    if (!formData.name.trim() || !formData.organisation.trim()) {
      setErrors('Name and Organisation are required.');
      return;
    }

    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrors('Please provide at least one of Email or Phone Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          organisation: formData.organisation.trim(),
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          conversation_id: conversationId,
          activity_duration_ms: activityDuration
        })
      });

      if (response.ok) {
        // Store user data for initials
        localStorage.setItem('sakshamai:leadData', JSON.stringify({
          name: formData.name.trim(),
          organisation: formData.organisation.trim()
        }));
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setFormData({ name: '', organisation: '', email: '', phone: '' });
          // Trigger a refresh of the chatbot to update initials
          window.dispatchEvent(new Event('userDataUpdated'));
        }, 3000);
      } else {
        const errorData = await response.json();
        // Show detailed error in development, simple message in production
        const errorMessage = errorData.message 
          ? `${errorData.error}: ${errorData.message}` 
          : errorData.error || 'Failed to submit. Please try again.';
        setErrors(errorMessage);
        // Log full error details to console for debugging
        if (process.env.NODE_ENV === 'development') {
          console.error('Lead submission error:', errorData);
        }
      }
    } catch (error) {
      setErrors('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001] animate-fade-in p-4">
        <div className="bg-cream-50 border-2 border-brown-200 rounded-lg shadow-2xl max-w-md w-full p-4 sm:p-6 animate-scale-in">
          <h3 className="text-lg sm:text-xl font-semibold text-brown-900 mb-4">Thank You! 🙏</h3>
          <p className="text-sm sm:text-base text-brown-700 mb-6 leading-relaxed">
            Your details have been submitted successfully. Saksham would be in touch. Till then, let's continue our discussion!
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 transition-colors font-medium text-base min-h-[44px]"
          >
            Continue Chatting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001] animate-fade-in p-4">
      <div className="bg-cream-50 border-2 border-brown-200 rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-brown-900 mb-2">Let's Connect!</h3>
          <p className="text-sm text-brown-700 mb-4 sm:mb-6">
            Please provide your details and we'll get back to you soon.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-brown-900 mb-1">
                Name <span className="text-brown-600">*</span>
              </label>
              <input
                type="text"
                id="contactName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 text-base border border-brown-300 rounded-md bg-cream-50 text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-400 focus:border-brown-400"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="contactOrg" className="block text-sm font-medium text-brown-900 mb-1">
                Organisation <span className="text-brown-600">*</span>
              </label>
              <input
                type="text"
                id="contactOrg"
                value={formData.organisation}
                onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                required
                className="w-full px-4 py-2.5 text-base border border-brown-300 rounded-md bg-cream-50 text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-400 focus:border-brown-400"
                placeholder="Your organisation"
              />
            </div>

            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-brown-900 mb-1">
                Email
              </label>
              <input
                type="email"
                id="contactEmail"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-brown-300 rounded-md bg-cream-50 text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-400 focus:border-brown-400"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-brown-900 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="contactPhone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 text-base border border-brown-300 rounded-md bg-cream-50 text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-400 focus:border-brown-400"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <p className="text-xs text-brown-600">
              <span className="text-brown-600">*</span> Required fields. At least one of Email or Phone is required.
            </p>

            {errors && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
                {errors}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2.5 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-base min-h-[44px]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-cream-200 text-brown-700 border border-brown-300 rounded-md hover:bg-cream-300 transition-colors font-medium text-base min-h-[44px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
