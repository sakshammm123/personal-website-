'use client';

import { useEffect, useState } from 'react';

export default function CookieConsent() {
  const [showModal, setShowModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sakshamai:cookieConsent');
    if (!consent) {
      setShowModal(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('sakshamai:cookieConsent', JSON.stringify({
      essential: true,
      analytics: true,
      timestamp: new Date().toISOString()
    }));
    localStorage.setItem('sakshamai:analyticsEnabled', 'true');
    setShowModal(false);
  };

  const savePreferences = () => {
    const analyticsEnabled = (document.getElementById('analyticsCookies') as HTMLInputElement)?.checked || false;
    localStorage.setItem('sakshamai:cookieConsent', JSON.stringify({
      essential: true,
      analytics: analyticsEnabled,
      timestamp: new Date().toISOString()
    }));
    localStorage.setItem('sakshamai:analyticsEnabled', analyticsEnabled ? 'true' : 'false');
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] animate-fade-in">
      <div className="bg-cream-50 border-2 border-brown-200 rounded-lg shadow-2xl max-w-md w-[90%] max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-brown-900 mb-2">🍪 Cookie Preferences</h3>
            <p className="text-sm text-brown-700 leading-relaxed">
              We use cookies to enhance your experience and track visitor analytics. Please choose your preferences to continue.
            </p>
          </div>

          {showOptions && (
            <div className="space-y-4 mb-6">
              <label className="flex items-start gap-3 p-3 bg-cream-100 rounded-md border border-brown-200 cursor-pointer">
                <input
                  type="checkbox"
                  id="essentialCookies"
                  checked
                  disabled
                  className="mt-1 w-4 h-4 text-brown-600 border-brown-300 rounded focus:ring-brown-400"
                />
                <div>
                  <strong className="text-brown-900 text-sm block mb-1">Essential Cookies</strong>
                  <span className="text-xs text-brown-600">
                    Required for the website to function properly. Always enabled.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 bg-cream-100 rounded-md border border-brown-200 cursor-pointer">
                <input
                  type="checkbox"
                  id="analyticsCookies"
                  className="mt-1 w-4 h-4 text-brown-600 border-brown-300 rounded focus:ring-brown-400"
                />
                <div>
                  <strong className="text-brown-900 text-sm block mb-1">Analytics Cookies</strong>
                  <span className="text-xs text-brown-600">
                    Help us understand how visitors interact with the chatbot.
                  </span>
                </div>
              </label>
            </div>
          )}

          <div className="flex gap-3">
            {!showOptions ? (
              <>
                <button
                  onClick={acceptAll}
                  className="flex-1 px-4 py-2.5 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 transition-colors font-medium"
                >
                  Accept All Cookies
                </button>
                <button
                  onClick={() => setShowOptions(true)}
                  className="flex-1 px-4 py-2.5 bg-cream-200 text-brown-700 border border-brown-300 rounded-md hover:bg-cream-300 transition-colors font-medium"
                >
                  Choose
                </button>
              </>
            ) : (
              <button
                onClick={savePreferences}
                className="w-full px-4 py-2.5 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 transition-colors font-medium"
              >
                Save Preferences
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
