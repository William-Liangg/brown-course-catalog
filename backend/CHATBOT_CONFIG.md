# Chatbot Configuration Guide

## Preventing Fake Course Information

The chatbot has been updated with strict validation to ensure it only returns real courses from your Brown University database. Here are the key safety features:

### 1. Database-Only Mode (Recommended)

To completely disable AI and use only database responses, set this environment variable:

```bash
FORCE_DATABASE_ONLY=true
```

This mode:
- ✅ Only returns courses that exist in your database
- ✅ No AI-generated fake course codes or titles
- ✅ Fast, reliable responses
- ✅ 100% accurate course information

### 2. AI Mode with Validation

If you want to use AI features, the system now includes:

- **Strict Course Validation**: AI responses are checked against your database
- **Fake Course Filtering**: Any made-up course codes are automatically removed
- **Fallback System**: If AI fails, it falls back to database-only responses
- **Response Sanitization**: Invalid course mentions are replaced with generic text

### 3. Environment Variables

```bash
# Required
DATABASE_URL=postgresql://username:password@localhost:5432/brown_courses

# Optional - OpenAI API key for AI features
OPENAI_API_KEY=your-openai-api-key-here

# Recommended - Force database-only mode
FORCE_DATABASE_ONLY=true

# Server
PORT=3001
NODE_ENV=development
```

### 4. Safety Features Implemented

1. **Course Code Validation**: All AI responses are scanned for course codes and validated against your database
2. **Response Sanitization**: Fake course codes are automatically replaced
3. **Fallback System**: Multiple layers of fallback to ensure responses are always accurate
4. **Session Context**: Tracks user interactions to provide better, more relevant responses
5. **Major Detection**: Automatically detects user's academic interests for better course matching

### 5. Testing the System

To verify the chatbot is working correctly:

1. Ask about specific courses (e.g., "Tell me about CSCI 0150")
2. Ask for recommendations in a specific field
3. Check that all returned course codes exist in your database

### 6. Troubleshooting

If you still see fake courses:

1. Set `FORCE_DATABASE_ONLY=true`
2. Check your database connection
3. Verify the `courses` table has the correct data
4. Check the server logs for validation warnings

The chatbot is now much safer and will only provide accurate, database-verified course information! 