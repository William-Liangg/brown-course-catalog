import { useState, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, X, Sparkles, RefreshCw } from 'lucide-react';
import { getAICourseRecommendations, sendChatMessage } from '../utils/api';

interface Recommendation {
  code: string;
  title: string;
  reason: string;
  confidence?: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  recommendations?: Recommendation[];
  timestamp: Date;
}

interface SessionContext {
  major: string | null;
  interests: string[];
  conversationHistory: any[];
}

const CourseChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm your AI course advisor. I can recommend courses for your major! Try asking about specific subjects like: **APMA** (Applied Math), **CSCI** (Computer Science), **MATH**, **ECON** (Economics), **BIOL** (Biology), **CLPS** (Psychology), etc. 🎓",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [sessionContext, setSessionContext] = useState<SessionContext>({
    major: null,
    interests: [],
    conversationHistory: []
  });

  // Generate a unique session ID when component mounts
  useEffect(() => {
    console.log('🤖 CourseChatbot session started:', sessionId);
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    console.log('🤖 Chatbot: Processing message:', userInput);
    console.log('🤖 Chatbot: Session ID:', sessionId);
    console.log('🤖 Chatbot: Current context:', sessionContext);

    try {
      // Check if the user is asking for course recommendations
      const recommendationKeywords = ['recommend', 'course', 'class', 'interested in', 'looking for', 'want to learn', 'study', 'suggest'];
      const isAskingForRecommendations = recommendationKeywords.some(keyword => 
        userInput.toLowerCase().includes(keyword)
      );

      console.log('🤖 Chatbot: Is asking for recommendations:', isAskingForRecommendations);

      if (isAskingForRecommendations) {
        // Enhanced major detection from conversation context
        const previousMessages = messages.slice(-3); // Get last 3 messages for context
        const computerScienceContext = previousMessages.some(msg => 
          msg.content.toLowerCase().includes('computer science') || 
          msg.content.toLowerCase().includes('cs') ||
          msg.content.toLowerCase().includes('programming') ||
          msg.content.toLowerCase().includes('algorithms') ||
          msg.content.toLowerCase().includes('software')
        );
        
        const detectedMajor = computerScienceContext ? 'computer science' : sessionContext.major || '';
        
        console.log('🤖 Chatbot: Detected major:', detectedMajor);
        console.log('🤖 Chatbot: Computer science context found:', computerScienceContext);
        
        // Use AI course recommendations with session context
        const response = await getAICourseRecommendations(detectedMajor, userInput, sessionId);
        
        console.log('🤖 Chatbot: AI response received:', response);
        
        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: `Based on your interests, here are some courses I think you'd love:`,
          recommendations: response.recommendations,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // Update session context
        if (response.context) {
          setSessionContext(prev => ({
            ...prev,
            major: response.context.major || prev.major,
            interests: [...new Set([...prev.interests, userInput])]
          }));
        }
      } else {
        // Enhanced major detection for general chat
        const computerScienceKeywords = ['computer science', 'cs', 'programming', 'algorithms', 'software', 'coding'];
        const isComputerScience = computerScienceKeywords.some(keyword => 
          userInput.toLowerCase().includes(keyword)
        );
        
        console.log('🤖 Chatbot: Computer science keywords detected:', isComputerScience);
        
        // Use general chat with session context
        const chatResponse = await sendChatMessage(userInput, sessionId);
        
        console.log('🤖 Chatbot: Chat response received:', chatResponse);
        
        const botMessage: ChatMessage = {
          id: `bot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'bot',
          content: chatResponse.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        
        // Update session context
        if (chatResponse.context) {
          setSessionContext(prev => ({
            ...prev,
            major: chatResponse.context.major || prev.major
          }));
        } else if (isComputerScience) {
          // If computer science keywords detected, update context
          setSessionContext(prev => ({
            ...prev,
            major: 'computer science'
          }));
        }
      }
    } catch (error) {
      console.error('🤖 Chatbot: Error occurred:', error);
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearSession = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: "Hi! I'm your AI course advisor. I can recommend courses for your major! Try asking about specific subjects like: **APMA** (Applied Math), **CSCI** (Computer Science), **MATH**, **ECON** (Economics), **BIOL** (Biology), **CLPS** (Psychology), etc. 🎓",
        timestamp: new Date()
      }
    ]);
    setSessionContext({
      major: null,
      interests: [],
      conversationHistory: []
    });
    console.log('🔄 Session cleared');
  };

  const getConfidenceBadge = (confidence?: string) => {
    if (!confidence) return null;
    
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${colors[confidence as keyof typeof colors] || colors.medium}`}>
        {confidence} confidence
      </span>
    );
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-amber-600 text-white p-4 rounded-full shadow-lg hover:bg-amber-700 transition-all duration-200 z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">AI Course Advisor</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearSession}
                  className="text-white hover:text-amber-200 transition-colors"
                  title="Clear conversation"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs">Powered by AI</span>
                </div>
              </div>
            </div>
            {sessionContext.major && (
              <div className="mt-2 text-xs text-amber-200">
                📚 Detected major: {sessionContext.major}
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg p-3`}>
                  <div className="flex items-start space-x-2">
                    {message.type === 'bot' && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      
                      {/* Recommendations */}
                      {message.recommendations && (
                        <div className="mt-3 space-y-2">
                          {message.recommendations.map((rec, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {rec.code} - {rec.title}
                                  </h4>
                                  {getConfidenceBadge(rec.confidence)}
                                </div>
                                <p className="text-gray-600 text-xs">{rec.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.type === 'user' && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me what you're interested in..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {sessionContext.interests.length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                💡 I remember you're interested in: {sessionContext.interests.slice(-3).join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseChatbot; 