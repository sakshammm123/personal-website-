// Analytics utility functions

/**
 * Check if user-agent is a bot/crawler
 */
export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;

  const botPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i, // Yahoo
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /sogou/i,
    /exabot/i,
    /facebot/i,
    /ia_archiver/i,
    /scraper/i,
    /crawler/i,
    /spider/i,
    /bot/i,
    /crawl/i,
    /curl/i,
    /wget/i,
    /python-requests/i,
    /postman/i,
    /insomnia/i,
    /http/i, // Generic HTTP clients
  ];

  return botPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Anonymize IP address by removing last octet
 * Example: 192.168.1.100 -> 192.168.1.0
 */
export function anonymizeIp(ipAddress: string | null): string | null {
  if (!ipAddress || ipAddress === 'unknown') return null;

  // Handle IPv4
  if (ipAddress.includes('.')) {
    const parts = ipAddress.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  // Handle IPv6 (simplified - just return null for now)
  // In production, you might want to anonymize IPv6 differently
  if (ipAddress.includes(':')) {
    return null; // Or implement IPv6 anonymization
  }

  return ipAddress;
}

/**
 * Extract device type from user agent
 */
export function getDeviceType(userAgent: string | null): string | null {
  if (!userAgent) return null;

  const ua = userAgent.toLowerCase();

  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    // Check if it's a tablet
    if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/i.test(ua)) {
      return 'tablet';
    }
    return 'mobile';
  }

  return 'desktop';
}

/**
 * Extract browser name and version from user agent
 */
export function getBrowserInfo(userAgent: string | null): { name: string | null; version: string | null } {
  if (!userAgent) return { name: null, version: null };

  const ua = userAgent.toLowerCase();

  // Chrome (including Edge Chromium)
  if (/chrome/i.test(ua) && !/edg/i.test(ua)) {
    const match = ua.match(/chrome\/([\d.]+)/);
    return {
      name: 'Chrome',
      version: match ? match[1] : null,
    };
  }

  // Edge
  if (/edg/i.test(ua)) {
    const match = ua.match(/edg\/([\d.]+)/);
    return {
      name: 'Edge',
      version: match ? match[1] : null,
    };
  }

  // Firefox
  if (/firefox/i.test(ua)) {
    const match = ua.match(/firefox\/([\d.]+)/);
    return {
      name: 'Firefox',
      version: match ? match[1] : null,
    };
  }

  // Safari
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    const match = ua.match(/version\/([\d.]+)/);
    return {
      name: 'Safari',
      version: match ? match[1] : null,
    };
  }

  // Opera
  if (/opera|opr/i.test(ua)) {
    const match = ua.match(/(?:opera|opr)\/([\d.]+)/);
    return {
      name: 'Opera',
      version: match ? match[1] : null,
    };
  }

  return { name: null, version: null };
}

/**
 * Extract OS from user agent
 */
export function getOS(userAgent: string | null): string | null {
  if (!userAgent) return null;

  const ua = userAgent.toLowerCase();

  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os x/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  if (/android/i.test(ua)) return 'Android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';

  return null;
}

/**
 * Categorize referrer
 */
export function categorizeReferrer(referrer: string | null): string | null {
  if (!referrer) return 'direct';

  // Handle server-side (no window object)
  if (typeof window === 'undefined') {
    const ref = referrer.toLowerCase();
    
    // Search engines
    if (/google|bing|yahoo|duckduckgo|baidu|yandex/i.test(ref)) {
      return 'search';
    }
    
    // Social media
    if (/facebook|twitter|linkedin|instagram|pinterest|reddit|tiktok|youtube/i.test(ref)) {
      return 'social';
    }
    
    return 'external';
  }

  const ref = referrer.toLowerCase();

  // Internal referrer
  if (ref.includes(window.location.hostname)) {
    return 'internal';
  }

  // Search engines
  if (/google|bing|yahoo|duckduckgo|baidu|yandex/i.test(ref)) {
    return 'search';
  }

  // Social media
  if (/facebook|twitter|linkedin|instagram|pinterest|reddit|tiktok|youtube/i.test(ref)) {
    return 'social';
  }

  // External
  return 'external';
}

/**
 * Generate or retrieve session ID from cookie
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') return '';

  // Check if session ID exists in cookie
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find(c => c.trim().startsWith('sakshamai:sessionId='));
  
  if (sessionCookie) {
    return sessionCookie.split('=')[1];
  }

  // Generate new session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Set cookie (expires in 30 minutes of inactivity)
  const expires = new Date();
  expires.setTime(expires.getTime() + 30 * 60 * 1000);
  document.cookie = `sakshamai:sessionId=${sessionId}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;

  return sessionId;
}

/**
 * Check if analytics is enabled (respects cookie consent)
 */
export function isAnalyticsEnabled(): boolean {
  if (typeof window === 'undefined') return false;

  const consent = localStorage.getItem('sakshamai:cookieConsent');
  if (!consent) return false;

  try {
    const consentData = JSON.parse(consent);
    return consentData.analytics === true;
  } catch {
    return false;
  }
}
