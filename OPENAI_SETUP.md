# OpenAI API Setup for AI Chatbot

## Overview
The AI chatbot now uses OpenAI's GPT-4o-mini model to provide intelligent course recommendations and general academic guidance. The system includes fallback functionality if the API key is not configured.

## Setup Instructions

### 1. Get an OpenAI API Key
1. Go to [OpenAI's website](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key (it starts with `sk-`)

### 2. Configure the API Key
1. Open the `env.local` file in the root directory
2. Find the line: `OPENAI_API_KEY=your-openai-api-key-here`
3. Replace `your-openai-api-key-here` with your actual API key
4. Save the file

Example:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Restart the Server
After updating the API key, restart the backend server:
```bash
# Stop the current server (Ctrl+C)
# Then restart it
cd backend && node simple-server.cjs
```

## Features

### AI Course Recommendations
- **Smart Analysis**: The AI analyzes your interests and major to recommend relevant courses
- **Detailed Explanations**: Each recommendation includes a specific reason why the course matches your interests
- **Fallback System**: If OpenAI is unavailable, the system falls back to keyword-based recommendations

### General Chat
- **Academic Guidance**: Ask general questions about Brown University, majors, requirements, etc.
- **Course Information**: Get information about specific courses or departments
- **Friendly Interface**: The AI provides encouraging and helpful responses

## Usage Examples

### Course Recommendations
- "I'm interested in computer science and want to learn about algorithms"
- "Can you recommend courses for someone studying economics?"
- "I want to learn about psychology and human behavior"

### General Questions
- "What are the requirements for the Computer Science major?"
- "Tell me about Brown's course registration process"
- "What are some popular introductory courses?"

## Troubleshooting

### API Key Issues
- **Error**: "OpenAI API key not configured"
- **Solution**: Make sure you've added your API key to `env.local` and restarted the server

### Rate Limiting
- **Error**: "Rate limit exceeded"
- **Solution**: Wait a moment and try again, or check your OpenAI account usage

### Network Issues
- **Error**: "Failed to connect to OpenAI"
- **Solution**: Check your internet connection and try again

## Fallback Mode
If the OpenAI API is unavailable or not configured, the chatbot will:
1. Use keyword-based course recommendations
2. Provide helpful fallback responses
3. Still function for basic course discovery

## Security Notes
- Never commit your API key to version control
- The `env.local` file is already in `.gitignore`
- Keep your API key secure and don't share it publicly

## Cost Considerations
- OpenAI charges per API call
- GPT-4o-mini is relatively inexpensive (~$0.00015 per 1K input tokens)
- Monitor your usage in the OpenAI dashboard
- Consider setting up usage limits in your OpenAI account 