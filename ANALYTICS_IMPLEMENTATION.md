# Analytics Implementation Summary

## ✅ Implemented Visitor Tracking Improvements

All analytics improvements from the gap analysis have been implemented:

### 1. ✅ Bot/Spam Filtering
- **Bot Detection**: Filters common bots and crawlers (Googlebot, Bingbot, etc.)
- **Implementation**: 
  - `src/lib/analytics-utils.ts` - `isBot()` function
  - Applied in tracking API route
  - Bots are excluded from analytics by default
- **Configuration**: Set `TRACK_BOTS=true` in `.env` to track bots
- **Result**: Clean analytics data without bot noise

### 2. ✅ Improved Unique Visit Counting
- **Session-Based Tracking**: Uses cookies + IP combination for better accuracy
- **Implementation**:
  - `getSessionId()` function creates/retrieves session cookies
  - Sessions expire after 30 minutes of inactivity
  - Unique visits calculated using `sessionId` (falls back to IP)
- **Result**: More accurate unique visitor counts

### 3. ✅ Privacy Compliance (GDPR/CCPA)
- **Cookie Consent**: Already implemented in `CookieConsent.tsx`
- **IP Anonymization**: Last octet removed from IP addresses
- **Opt-Out Mechanism**: Users can disable analytics via cookie preferences
- **Implementation**:
  - `anonymizeIp()` function removes last octet
  - `isAnalyticsEnabled()` checks cookie consent
  - PageTracker respects user preferences
- **Result**: GDPR/CCPA compliant tracking

### 4. ✅ Data Retention Policy
- **Retention Period**: 1 year for page visits, 30 days for login attempts
- **Auto-Cleanup**: Automatic deletion of old data
- **Implementation**:
  - `src/lib/data-retention.ts` - Cleanup utilities
  - `/api/admin/cleanup` endpoint for manual cleanup
- **Result**: Database doesn't grow indefinitely

### 5. ✅ Analytics Dimensions
- **Device Type**: Mobile, tablet, desktop detection
- **Browser Info**: Browser name and version
- **Operating System**: OS detection
- **Geographic Location**: Country and city (placeholder for geolocation service)
- **Referrer Categorization**: Search, social, direct, external, internal
- **Implementation**: All extracted from user-agent and stored in database
- **Result**: Rich analytics data for insights

### 6. ✅ Conversion Tracking
- **Conversation Linking**: Page visits linked to chatbot conversations
- **Conversion Path**: Track which pages lead to contact form submissions
- **Implementation**:
  - `conversationId` field in PageVisit model
  - `/api/analytics/conversion` endpoint
  - PageTracker captures conversation ID from localStorage
- **Result**: Can track conversion funnels

### 7. ✅ Bounce Rate Calculation
- **Definition**: Single-page visits (sessions with only one page view)
- **Metrics**: 
  - Bounce rate percentage
  - Average session duration
  - Total vs bounced sessions
- **Implementation**: `/api/analytics/bounce-rate` endpoint
- **Result**: Understand user engagement

### 8. ✅ Page Performance Tracking
- **Core Web Vitals**: 
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Cumulative Layout Shift (CLS)
  - First Input Delay (FID)
- **Page Load Time**: Total page load duration
- **Implementation**: PerformanceObserver API in PageTracker
- **Result**: Monitor site performance

---

## 📋 Database Schema Changes

### Updated PageVisit Model

```prisma
model PageVisit {
  id                      Int      @id @default(autoincrement())
  path                    String
  referer                 String?
  refererCategory         String?  // "search", "social", "direct", "external", "internal"
  ipAddress               String?  // Anonymized IP
  userAgent               String?
  deviceType              String?  // "mobile", "tablet", "desktop"
  browser                 String?  // Browser name
  browserVersion          String?  // Browser version
  os                      String?  // Operating system
  country                 String?  // Country code
  city                    String?  // City name
  sessionId               String?  // Session identifier
  isBot                   Boolean  @default(false)
  loadTime                Int?     // Page load time (ms)
  firstContentfulPaint    Int?     // FCP (ms)
  largestContentfulPaint  Int?     // LCP (ms)
  cumulativeLayoutShift   Float?   // CLS score
  firstInputDelay         Int?     // FID (ms)
  conversationId          String?  // For conversion tracking
  createdAt               DateTime @default(now())

  @@index([path])
  @@index([createdAt])
  @@index([sessionId])
  @@index([isBot])
  @@index([conversationId])
  @@index([deviceType])
}
```

---

## 📁 New Files Created

1. `src/lib/analytics-utils.ts` - Bot detection, device detection, IP anonymization
2. `src/lib/geolocation.ts` - IP geolocation utilities (placeholder for service integration)
3. `src/lib/data-retention.ts` - Data cleanup utilities
4. `src/app/api/analytics/conversion/route.ts` - Conversion tracking endpoint
5. `src/app/api/analytics/bounce-rate/route.ts` - Bounce rate calculation
6. `src/app/api/admin/cleanup/route.ts` - Admin cleanup endpoint

---

## 🔧 Modified Files

1. `prisma/schema.prisma` - Extended PageVisit model with new fields
2. `src/app/api/analytics/track/route.ts` - Enhanced tracking with all new features
3. `src/app/api/analytics/stats/route.ts` - Updated to use sessionId and exclude bots
4. `src/components/PageTracker.tsx` - Added performance tracking and session management

---

## 🚀 Next Steps

### 1. Run Database Migration

```bash
npx prisma migrate dev --name enhance_analytics_tracking
```

Or:

```bash
npx prisma db push
```

### 2. Update Environment Variables

Add to `.env` (optional):

```env
# Set to true if you want to track bots
TRACK_BOTS=false
```

### 3. Set Up Geolocation (Optional)

For accurate location tracking, integrate a geolocation service:

**Option 1: ipapi.co** (Free tier: 1,000 requests/day)
```typescript
// In src/lib/geolocation.ts
const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
const data = await response.json();
return {
  country: data.country_code || null,
  city: data.city || null,
};
```

**Option 2: MaxMind GeoIP2** (Requires license)
**Option 3: ipgeolocation.io** (Free tier available)

### 4. Schedule Data Cleanup

Set up a cron job or scheduled task to run cleanup:

```bash
# Example cron job (runs daily at 2 AM)
0 2 * * * curl -X POST https://yourdomain.com/api/admin/cleanup \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Or use a service like:
- Vercel Cron Jobs
- GitHub Actions
- AWS Lambda + EventBridge

---

## 📊 New API Endpoints

### GET `/api/analytics/conversion?conversationId=xxx`
Get conversion path for a specific conversation.

**Response:**
```json
{
  "conversationId": "conv_123",
  "conversionPath": [
    {
      "path": "/",
      "referer": "https://google.com",
      "refererCategory": "search",
      "deviceType": "desktop",
      "browser": "Chrome",
      "country": "US",
      "timestamp": "2026-02-09T10:00:00Z"
    }
  ],
  "totalPages": 3
}
```

### GET `/api/analytics/bounce-rate?days=7`
Get bounce rate statistics.

**Response:**
```json
{
  "totalSessions": 150,
  "bouncedSessions": 45,
  "bounceRate": 30.0,
  "avgSessionDuration": 120,
  "nonBouncedSessions": 105
}
```

### POST `/api/admin/cleanup`
Run data retention cleanup (admin only).

**Response:**
```json
{
  "success": true,
  "message": "Data retention cleanup completed"
}
```

---

## 🎯 Usage Examples

### Track Conversion Path

```typescript
// In chatbot component, when conversation starts:
localStorage.setItem('sakshamai:conversationId', conversationId);

// Later, get conversion path:
const response = await fetch(`/api/analytics/conversion?conversationId=${conversationId}`);
const data = await response.json();
console.log('User visited:', data.conversionPath.map(v => v.path));
```

### Check Bounce Rate

```typescript
const response = await fetch('/api/analytics/bounce-rate?days=30');
const stats = await response.json();
console.log(`Bounce rate: ${stats.bounceRate}%`);
```

---

## 🔍 Analytics Features Summary

| Feature | Status | Impact |
|---------|--------|--------|
| Bot Filtering | ✅ | High - Clean data |
| Session Tracking | ✅ | High - Accurate counts |
| Privacy Compliance | ✅ | Critical - Legal requirement |
| Data Retention | ✅ | Medium - Database management |
| Device/Browser Tracking | ✅ | Medium - User insights |
| Conversion Tracking | ✅ | High - Business intelligence |
| Bounce Rate | ✅ | Medium - Engagement metrics |
| Performance Tracking | ✅ | High - Site optimization |

---

## ⚠️ Important Notes

1. **Geolocation**: Currently returns null. Integrate a geolocation service for accurate location data.

2. **Performance Metrics**: Some metrics (LCP, CLS, FID) require time to collect. The tracker waits 2 seconds before sending data.

3. **Session Cookies**: Sessions expire after 30 minutes of inactivity. Users returning after 30 minutes get a new session.

4. **Bot Detection**: Bots are excluded by default. Set `TRACK_BOTS=true` to track them.

5. **Privacy**: IP addresses are anonymized (last octet removed) for GDPR compliance.

6. **Cookie Consent**: Analytics only tracks if user has consented via cookie banner.

---

## 🐛 Troubleshooting

### Performance Metrics Not Collected
- Check browser console for errors
- Verify PerformanceObserver API is supported
- Some metrics require user interaction (FID)

### Sessions Not Tracking
- Check cookie consent is accepted
- Verify cookies are enabled in browser
- Check localStorage for `sakshamai:analyticsEnabled`

### Geolocation Returns Null
- This is expected until you integrate a geolocation service
- See "Set Up Geolocation" section above

### Bounce Rate Seems High
- Normal bounce rates are 40-60% for most sites
- Single-page sites naturally have higher bounce rates
- Check if bot filtering is working correctly

---

## 📚 Additional Resources

- [Core Web Vitals](https://web.dev/vitals/)
- [GDPR Compliance Guide](https://gdpr.eu/)
- [Session Tracking Best Practices](https://developers.google.com/analytics/devguides/collection/analyticsjs/cookies-user-id)
