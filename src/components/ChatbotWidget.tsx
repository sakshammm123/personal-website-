'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Fredoka } from 'next/font/google';
import ContactPopup from './ContactPopup';

const fredoka = Fredoka({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// Renders message text and turns /work and /education into clickable links
function MessageWithLinks({ text }: { text: string }) {
  const parts = text.split(/(\/work|\/education)\b/);
  return (
    <>
      {parts.map((part, i) =>
        part === '/work' ? (
          <Link key={i} href="/work" className="underline text-brown-700 hover:text-brown-900 font-medium">
            /work
          </Link>
        ) : part === '/education' ? (
          <Link key={i} href="/education" className="underline text-brown-700 hover:text-brown-900 font-medium">
            /education
          </Link>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

// Use same origin as the page so the chatbot always connects to this app's API
function getChatbotApiUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/chat`;
  }
  return '/api/chat';
}
const ACTIVITY_THRESHOLD_MS = 1 * 60 * 1000; // 1 minute
const TYPING_CHAR_MS = 18;

type ChatMessage = {
  text: string;
  sender: 'user' | 'bot';
  typing?: boolean;
  fullText?: string;
  question?: string; // Store the question for bot messages (for feedback)
  feedbackSubmitted?: boolean; // Track if feedback was submitted
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Hi, I'm Saksham.AI. I can share Saksham's experience, projects, and links. Ask away!", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showMeetPopup, setShowMeetPopup] = useState(false);
  const [activityStartTime, setActivityStartTime] = useState<number | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastBotMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const activityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get user initials from stored contact data
  const getUserInitials = () => {
    if (!userName) return 'U';
    const parts = userName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const stored = localStorage.getItem('sakshamai:conversationId');
    if (stored) setConversationId(stored);
    
    // Check if chatbot has been clicked before
    const clicked = localStorage.getItem('sakshamai:chatbotClicked') === 'true';
    setHasBeenClicked(clicked);
    
    // Get user name from stored contact data
    const storedLead = localStorage.getItem('sakshamai:leadData');
    if (storedLead) {
      try {
        const lead = JSON.parse(storedLead);
        if (lead.name) {
          setUserName(lead.name);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
    
    // Initialize website activity tracking (not just chatbot activity)
    const storedStartTime = localStorage.getItem('sakshamai:websiteActivityStartTime');
    const popupShown = localStorage.getItem('sakshamai:popupShown') === 'true';
    
    // Start tracking website activity from page load
    const startTime = storedStartTime ? parseInt(storedStartTime) : Date.now();
    if (!storedStartTime) {
      localStorage.setItem('sakshamai:websiteActivityStartTime', startTime.toString());
    }
    setActivityStartTime(startTime);
    
    if (!popupShown) {
      const elapsed = Date.now() - startTime;
      const remaining = ACTIVITY_THRESHOLD_MS - elapsed;
      
      if (remaining <= 0) {
        setShowMeetPopup(true);
      } else {
        activityTimerRef.current = setTimeout(() => {
          if (localStorage.getItem('sakshamai:popupShown') !== 'true') {
            setShowMeetPopup(true);
          }
        }, remaining);
      }
    }
    
    return () => {
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
    };
  }, []);

  // Listen for user data updates
  useEffect(() => {
    const handleUserDataUpdate = () => {
      const storedLead = localStorage.getItem('sakshamai:leadData');
      if (storedLead) {
        try {
          const lead = JSON.parse(storedLead);
          if (lead.name) {
            setUserName(lead.name);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => window.removeEventListener('userDataUpdated', handleUserDataUpdate);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll so the start of the latest bot message is visible (user doesn't have to scroll up to read)
  useEffect(() => {
    lastBotMessageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [messages]);

  // Typing animation: reveal bot reply character by character (interval runs until done)
  useEffect(() => {
    const lastIdx = messages.length - 1;
    const last = lastIdx >= 0 ? messages[lastIdx] : null;
    if (!last || last.sender !== 'bot' || !last.typing || !last.fullText) {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      return;
    }
    const fullText = last.fullText;
    if (last.text.length >= fullText.length) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === lastIdx ? { ...m, text: fullText, typing: false, fullText: undefined } : m
        )
      );
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      return;
    }
    if (typingIntervalRef.current) return;
    typingIntervalRef.current = setInterval(() => {
      setMessages((prev) => {
        const idx = prev.length - 1;
        const msg = prev[idx];
        if (!msg || msg.sender !== 'bot' || !msg.typing || !msg.fullText) return prev;
        const nextLen = Math.min(msg.text.length + 1, msg.fullText.length);
        const nextText = msg.fullText.slice(0, nextLen);
        const done = nextLen >= msg.fullText.length;
        if (done && typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        return prev.map((m, i) =>
          i === idx
            ? { ...m, text: nextText, typing: !done, fullText: done ? undefined : m.fullText }
            : m
        );
      });
    }, TYPING_CHAR_MS);
    return () => {};
  }, [messages]);

  const getCookieConsent = () => {
    const consent = localStorage.getItem('sakshamai:cookieConsent');
    return consent ? JSON.parse(consent) : { essential: true, analytics: false };
  };

  const handleChatbotClick = () => {
    setHasBeenClicked(true);
    localStorage.setItem('sakshamai:chatbotClicked', 'true');
    setIsOpen(!isOpen);
  };

  const sendMessage = async (content: string) => {
    if (isSending || !content.trim()) return;
    
    setIsSending(true);
    setInputValue('');
    
    // Add user message
    setMessages(prev => [...prev, { text: content, sender: 'user' }]);
    
    // Add typing indicator
    setMessages(prev => [...prev, { text: '...', sender: 'bot' as const }]);
    
    try {
      const consent = getCookieConsent();
      const res = await fetch(getChatbotApiUrl(), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Cookie-Consent': consent.analytics ? 'true' : 'false'
        },
        body: JSON.stringify({
          message: content,
          conversation_id: conversationId,
          cookie_consent: consent
        }),
      });

      const data = await res.json().catch(() => ({}));
      
      // Remove typing indicator
      setMessages(prev => prev.filter((m, idx) => !(idx === prev.length - 1 && m.text === '...' && m.sender === 'bot')));
      
      if (!res.ok) {
        const errorMsg = data.reply || data.message || data.error || `Request failed (${res.status})`;
        setMessages(prev => [...prev, { text: errorMsg, sender: 'bot' }]);
        return;
      }

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
        localStorage.setItem('sakshamai:conversationId', data.conversation_id);
      }

      const replyText = data.reply || "I'm here to help with Saksham's profile.";
      setMessages(prev => {
        // Get the last user message (the question)
        const lastUserMessage = [...prev].reverse().find(m => m.sender === 'user');
        return [...prev, { 
          text: '', 
          sender: 'bot', 
          typing: true, 
          fullText: replyText,
          question: lastUserMessage?.text || content
        }];
      });
    } catch (err) {
      // Remove typing indicator
      setMessages(prev => {
        const filtered = prev.filter((m, idx) => !(idx === prev.length - 1 && m.text === '...' && m.sender === 'bot'));
        
        // Provide more helpful error message
        let errorMessage = "Sorry, I'm having trouble connecting to the server.";
        if (err instanceof TypeError && err.message.includes('fetch')) {
          errorMessage = "Unable to reach the server. If you're running locally, start the site with: npm run dev";
        } else if (err instanceof Error) {
          errorMessage = `Connection error: ${err.message}`;
        }
        
        return [...filtered, { text: errorMessage, sender: 'bot' }];
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isSending) {
      sendMessage(inputValue.trim());
    }
  };

  const clearConversation = () => {
    localStorage.removeItem('sakshamai:conversationId');
    setConversationId(null);
    setMessages([{ text: "Hi, I'm Saksham.AI. I can share Saksham's experience, projects, and links. Ask away!", sender: 'bot' }]);
  };

  const handleContactPopupClose = () => {
    setShowContactPopup(false);
    setShowMeetPopup(false);
    localStorage.setItem('sakshamai:popupShown', 'true');
  };

  const handleMeetPopupYes = () => {
    setShowMeetPopup(false);
    setShowContactPopup(true);
  };

  const handleMeetPopupLater = () => {
    setShowMeetPopup(false);
    localStorage.setItem('sakshamai:popupShown', 'true');
  };

  return (
    <>
      {/* Launcher - bubble + icon move up and down together */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-0 animate-chatbot-bounce">
        {/* Speech bubble with funky font - tail points down to icon */}
        <div className="relative mb-1">
          <div
            className={`${fredoka.className} text-sm font-semibold text-brown-800 bg-cream-50 border-2 border-brown-300 px-3 py-1.5 rounded-2xl rounded-br-md shadow-md`}
          >
            Saksham.AI
          </div>
          {/* Bubble tail pointing down to icon */}
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-brown-300"
            aria-hidden
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 -bottom-[7px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-cream-50"
            aria-hidden
          />
        </div>
        <button
          onClick={handleChatbotClick}
          className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-cream-50 transition-all duration-200 flex items-center justify-center group ${
            hasBeenClicked
              ? 'shadow-lg hover:shadow-xl'
              : 'shadow-2xl hover:shadow-2xl'
          }`}
          aria-label="Open chatbot"
        >
          <img
            src="/chatbot-images/saksham-avatar-waving.png"
            alt="Chat"
            className="w-20 h-20 rounded-full object-contain"
          />
        </button>
      </div>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-28 right-4 left-4 sm:left-auto sm:w-96 h-[600px] max-h-[80vh] bg-cream-50 border-2 border-brown-200 rounded-lg shadow-2xl flex flex-col z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-brown-200 bg-cream-100 rounded-t-lg">
          <div className="flex items-center gap-3">
            {isSending ? (
              <img
                src="/chatbot-images/reply-loading.png"
                alt="Processing..."
                className="w-14 h-14 object-contain flex-shrink-0"
              />
            ) : (
              <img
                src="/chatbot-images/saksham-avatar.png"
                alt="Saksham.AI"
                className="w-14 h-14 rounded-full object-contain flex-shrink-0"
              />
            )}
            <div>
              <div className="font-semibold text-brown-900">Saksham.AI</div>
              <div className="text-xs text-brown-600">
                {isSending ? 'Processing your question...' : 'Recruiter concierge'}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={clearConversation}
              className="px-3 py-1.5 text-sm text-brown-700 hover:text-brown-900 hover:bg-brown-100 rounded-md transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-sm text-brown-700 hover:text-brown-900 hover:bg-brown-100 rounded-md transition-colors"
            >
              —
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isLastBot = msg.sender === 'bot' && idx === messages.length - 1;
            return (
              <div
                key={idx}
                ref={isLastBot ? lastBotMessageRef : undefined}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {msg.sender === 'bot' && (
                  <img
                    src="/chatbot-images/saksham-avatar.png"
                    alt="Saksham.AI"
                    className="w-12 h-12 rounded-full object-contain flex-shrink-0"
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    msg.sender === 'user'
                      ? 'bg-brown-600 text-cream-50'
                      : 'bg-cream-200 text-brown-900 border border-brown-200'
                  }`}
                >
                  {msg.sender === 'bot' ? (
                    msg.typing ? (
                      <span>
                        <MessageWithLinks text={msg.text} />
                        <span className="inline-block w-0.5 h-4 ml-0.5 bg-brown-600 animate-pulse align-middle" aria-hidden />
                      </span>
                    ) : (
                      <>
                        <MessageWithLinks text={msg.text} />
                        {/* Feedback buttons - only show for completed bot messages */}
                        {!msg.typing && msg.text && !msg.feedbackSubmitted && idx > 0 && (
                          <div className="flex gap-2 mt-2 pt-2 border-t border-brown-200">
                            <button
                              onClick={async () => {
                                const sessionId = localStorage.getItem('sakshamai:sessionId') || '';
                                try {
                                  await fetch('/api/chat/feedback', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      conversationId,
                                      question: msg.question || '',
                                      answer: msg.text,
                                      helpful: true,
                                      sessionId,
                                    }),
                                  });
                                  // Mark as feedback submitted
                                  setMessages(prev => prev.map((m, i) => 
                                    i === idx ? { ...m, feedbackSubmitted: true } : m
                                  ));
                                } catch (err) {
                                  console.error('Failed to submit feedback:', err);
                                }
                              }}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-green-700 hover:bg-green-50 rounded transition-colors"
                              title="Helpful"
                            >
                              <span>👍</span>
                              <span>Helpful</span>
                            </button>
                            <button
                              onClick={async () => {
                                const sessionId = localStorage.getItem('sakshamai:sessionId') || '';
                                try {
                                  await fetch('/api/chat/feedback', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      conversationId,
                                      question: msg.question || '',
                                      answer: msg.text,
                                      helpful: false,
                                      sessionId,
                                    }),
                                  });
                                  // Mark as feedback submitted
                                  setMessages(prev => prev.map((m, i) => 
                                    i === idx ? { ...m, feedbackSubmitted: true } : m
                                  ));
                                } catch (err) {
                                  console.error('Failed to submit feedback:', err);
                                }
                              }}
                              className="flex items-center gap-1 px-2 py-1 text-xs text-red-700 hover:bg-red-50 rounded transition-colors"
                              title="Not helpful"
                            >
                              <span>👎</span>
                              <span>Not helpful</span>
                            </button>
                          </div>
                        )}
                        {msg.feedbackSubmitted && (
                          <div className="text-xs text-brown-500 mt-2">Thank you for your feedback!</div>
                        )}
                      </>
                    )
                  ) : (
                    msg.text
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-12 h-12 rounded-full bg-brown-600 text-cream-50 flex items-center justify-center flex-shrink-0 text-sm font-semibold">
                    {getUserInitials()}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-brown-200">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about roles, skills, projects..."
              className="flex-1 px-4 py-2 text-base border border-brown-300 rounded-md bg-cream-50 text-brown-900 placeholder-brown-400 focus:outline-none focus:ring-2 focus:ring-brown-400 focus:border-brown-400"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !inputValue.trim()}
              className="px-6 py-2 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Send
            </button>
          </div>
        </form>
      </div>

      {/* Meet Real Guy Popup */}
      {showMeetPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10001] animate-fade-in">
          <div className="bg-cream-50 border-2 border-brown-200 rounded-lg shadow-2xl max-w-md w-[calc(100%-2rem)] sm:w-[90%] p-4 sm:p-6 animate-scale-in mx-4">
            <h3 className="text-xl font-semibold text-brown-900 mb-4">Want to meet the real guy?</h3>
            <p className="text-brown-700 mb-6 leading-relaxed">
              You've been chatting for a while! Would you like to connect with Saksham directly?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleMeetPopupYes}
                className="flex-1 px-4 py-2.5 bg-brown-600 text-cream-50 rounded-md hover:bg-brown-700 transition-colors font-medium"
              >
                Yes
              </button>
              <button
                onClick={handleMeetPopupLater}
                className="flex-1 px-4 py-2.5 bg-cream-200 text-brown-700 border border-brown-300 rounded-md hover:bg-cream-300 transition-colors font-medium"
              >
                Later, continue chatting
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Popup */}
      <ContactPopup
        isOpen={showContactPopup}
        onClose={handleContactPopupClose}
        conversationId={conversationId}
        activityDuration={activityStartTime ? Date.now() - activityStartTime : null}
      />
    </>
  );
}
