# OnYou API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints (except `/api/auth/*`) require authentication via NextAuth session cookies.

Unauthenticated requests will receive:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Unauthorized"
  }
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {} // Optional additional information
  }
}
```

### Common Error Codes
- `UNAUTHORIZED` (401) - Not authenticated
- `FORBIDDEN` (403) - Authenticated but not authorized
- `NOT_FOUND` (404) - Resource not found
- `BAD_REQUEST` (400) - Malformed request
- `VALIDATION_ERROR` (422) - Validation failed
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error

---

## Endpoints

### 1. User Profile

#### GET `/api/user`
Get current user's profile and stats.

**Rate Limit**: None (read-only)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "name": "김철수",
    "email": "user@example.com",
    "image": "https://...",
    "stats": {
      "friendCount": 12,
      "letterCount": 5,
      "surveyCount": 1
    }
  }
}
```

---

### 2. Self-Discovery Survey

#### POST `/api/discover`
Submit self-discovery survey answers.

**Rate Limit**: 10 requests/minute per user

**Request Body**:
```json
{
  "answers": {
    "basic1": 4,
    "past1": 5,
    "past2": 4,
    "past-select": ["나의 노력과 역량"],
    "past-text": "프로젝트를 성공적으로 완료했을 때",
    "present1": 4,
    "present2": 3,
    "present-select": 4,
    "present-text": "항상 긍정적으로 대해줘서",
    "future1": 5,
    "future2": 4,
    "future-text": "새로운 언어를 배우고 싶다"
  }
}
```

**Validation**:
- All score values must be numbers between 1-5
- Text answers can be strings
- Multiple choice can be arrays of strings

**Response**:
```json
{
  "success": true,
  "data": {
    "radarData": [
      { "subject": "회복탄력성", "A": 4, "fullMark": 5 },
      { "subject": "성취자부심", "A": 4.5, "fullMark": 5 },
      { "subject": "긍정적 영향", "A": 4, "fullMark": 5 },
      { "subject": "소속감", "A": 3.5, "fullMark": 5 },
      { "subject": "잠재력", "A": 5, "fullMark": 5 },
      { "subject": "성장기대", "A": 4, "fullMark": 5 }
    ]
  },
  "message": "Survey submitted successfully"
}
```

#### GET `/api/discover`
Get existing survey results with peer feedback.

**Response**:
```json
{
  "success": true,
  "data": {
    "exists": true,
    "radarData": [ /* Radar data with peer averages */ ],
    "answers": { /* Original survey answers */ },
    "peerAnswers": {
      "q1": [{ "text": "...", "author": "친구이름" }],
      "q2": [...],
      "q3": [...]
    },
    "peerCount": 3,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. Friends

#### GET `/api/friends`
Get list of friends (registered users + guest respondents).

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "user123",
      "name": "친구이름",
      "avatar": "/placeholder-user.jpg",
      "relation": "고등학교 친구",
      "tags": ["funny", "smart"],
      "closeness": 85,
      "lastInteraction": "최근",
      "type": "USER"
    },
    {
      "id": "feedback456",
      "name": "익명 친구",
      "avatar": null,
      "relation": "피드백 게스트",
      "tags": ["게스트", "피드백완료"],
      "closeness": 0,
      "lastInteraction": "2024-01-15",
      "type": "GUEST"
    }
  ]
}
```

---

### 4. Peer Feedback

#### POST `/api/feedback`
Submit peer feedback via invite code (for non-registered users).

**Rate Limit**: 100 requests/hour per invite code

**Request Body**:
```json
{
  "inviteCode": "ABC123",
  "respondentName": "김친구",
  "scores": {
    "basic1": 4,
    "past1": 5,
    "past2": 4,
    /* ... other scores */
  },
  "answers": {
    "past-text": "항상 열심히 하는 모습",
    "present-text": "고민을 잘 들어줘서",
    "future-text": "세계여행을 도전했으면"
  }
}
```

**Validation**:
- `inviteCode`: Required, must be valid and not expired
- `respondentName`: Required, will be sanitized
- `scores`: Required, all values 1-5
- `answers`: Required

**Response**:
```json
{
  "success": true,
  "data": {
    "feedbackId": "feedback123"
  },
  "message": "Feedback submitted successfully"
}
```

**Errors**:
- `404 NOT_FOUND`: Invalid invite code
- `400 BAD_REQUEST`: Expired invite or max uses reached

#### POST `/api/friends/feedback`
Submit peer feedback for a registered friend.

**Rate Limit**: 50 requests/hour per user

**Request Body**:
```json
{
  "targetUserId": "user123",
  "scores": { /* same as above */ },
  "answers": { /* same as above */ }
}
```

**Response**: Same as `/api/feedback`

---

### 5. Invites

#### POST `/api/invites`
Create a new invite code.

**Rate Limit**: 10 requests/hour per user

**Request Body**: None

**Response**:
```json
{
  "success": true,
  "data": {
    "code": "XYZ789"
  },
  "message": "Invite code created successfully"
}
```

**Properties**:
- Code expires in 7 days
- Maximum 100 uses per code

---

### 6. Letters

#### POST `/api/letters`
Send a letter to a friend.

**Rate Limit**: 20 requests/hour per user

**Request Body**:
```json
{
  "content": "안녕! 오늘도 화이팅!",
  "template": "cheerup",
  "recipientName": "친구이름"
}
```

**Validation**:
- `content`: Required, max 10,000 characters, HTML sanitized
- `template`: Optional, defaults to "default"
- `recipientName`: Optional, will try to link to registered user

**Response**:
```json
{
  "success": true,
  "data": {
    "letterId": "letter123"
  },
  "message": "Letter sent successfully"
}
```

---

## Rate Limiting

All endpoints have rate limiting to prevent abuse:

| Endpoint | Limit |
|----------|-------|
| `/api/discover` POST | 10 req/min per user |
| `/api/friends` GET | No limit |
| `/api/feedback` POST | 100 req/hour per invite |
| `/api/friends/feedback` POST | 50 req/hour per user |
| `/api/invites` POST | 10 req/hour per user |
| `/api/letters` POST | 20 req/hour per user |
| `/api/user` GET | No limit |

When rate limit is exceeded:
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later."
  }
}
```

---

## Security

### Input Validation
- All text inputs are sanitized to prevent XSS attacks
- Numeric inputs are validated for range (1-5 for scores)
- JSON parsing is wrapped in try-catch to prevent crashes

### Authentication
- All routes require valid NextAuth session
- Session tokens are httpOnly cookies

### Rate Limiting
- In-memory rate limiting (for production, use Redis)
- Prevents abuse and DoS attacks

---

## Examples

### JavaScript/TypeScript

```typescript
// Submit survey
const response = await fetch('/api/discover', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers: surveyAnswers })
});

const result = await response.json();

if (result.success) {
  console.log('Survey submitted:', result.data.radarData);
} else {
  console.error('Error:', result.error.message);
}
```

### Error Handling

```typescript
try {
  const res = await fetch('/api/friends');
  const result = await res.json();

  if (!result.success) {
    switch (result.error.code) {
      case 'UNAUTHORIZED':
        // Redirect to login
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Show rate limit message
        break;
      default:
        // Show generic error
    }
  }
} catch (error) {
  // Network error
  console.error('Network error:', error);
}
```
