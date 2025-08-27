import { useState } from 'react';
import { GraduationCap, Search, Calendar, Users, MessageCircle, Send, X } from "lucide-react"
import { getAICourseRecommendations } from './utils/api';

interface HomePageProps {
  onNavigate: (route: string) => void
  isLoggedIn: boolean
  userFirstName?: string
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const HomePage = ({ onNavigate, isLoggedIn, userFirstName }: HomePageProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi! I'm BrunoBot, your AI course advisor. How can I help you find the perfect courses today? 🎓",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleChatSend = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const latestUserMessage = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      const userInput = latestUserMessage.toLowerCase();
      let botResponse = "";

      // Check if user is asking about a major we can help with
      const majorKeywords = {
        'computer science': ['comp sci', 'csci', 'computer science', 'cs'],
        'math': ['math', 'mathematics'],
        'economics': ['econ', 'economics'],
        'biology': ['bio', 'biology'],
        'psychology': ['psych', 'psychology']
      };

      let detectedMajor = null;
      for (const [major, keywords] of Object.entries(majorKeywords)) {
        if (keywords.some(keyword => userInput.includes(keyword))) {
          detectedMajor = major;
          break;
        }
      }

      // Try to get AI recommendations if a major is detected
      let aiRecommendations = null;
      if (detectedMajor) {
        try {
          const response = await getAICourseRecommendations(detectedMajor, latestUserMessage);
          if (response.success && response.data.recommendations) {
            aiRecommendations = response.data;
          }
        } catch (error) {
          console.log('AI recommendation failed, using fallback response');
        }
      }

      // Generate response based on AI recommendations or fallback
      if (aiRecommendations && aiRecommendations.recommendations) {
        const recommendationsList = aiRecommendations.recommendations
          .map((rec: any) => `- **${rec.code}**: ${rec.title}\n  *${rec.reason}*`)
          .join('\n\n');
        
        botResponse = `🎓 Here are some personalized course recommendations for you:\n\n${recommendationsList}\n\n*Based on your interests in ${detectedMajor}*`;
      } else {
        // Fallback responses for when AI is not available
        if (detectedMajor === 'computer science') {
          botResponse = "Awesome choice! 🎉 Here are some Computer Science courses:\n\n- **CSCI 0150**: Introduction to Object-Oriented Programming\n- **CSCI 0160**: Data Structures and Algorithms\n- **CSCI 0320**: Introduction to Software Engineering\n- **CSCI 0330**: Computer Systems\n\nWant me to filter by intro-level, systems, AI, or advanced electives?";
        } 
        else if (detectedMajor === 'math') {
          botResponse = "Math is super important! Here are some popular options:\n\n- **MATH 0090**: Single Variable Calculus I\n- **MATH 0100**: Single Variable Calculus II\n- **MATH 0520**: Linear Algebra\n- **MATH 0540**: Linear Algebra with Applications\n\nShould I pair these with other STEM classes for you?";
        }
        else if (detectedMajor === 'economics') {
          botResponse = "Great choice! Here are some Economics courses:\n\n- **ECON 0110**: Principles of Economics\n- **ECON 1130**: Intermediate Microeconomics\n- **ECON 1210**: Intermediate Macroeconomics\n- **ECON 1620**: Introduction to Econometrics\n\nInterested in micro, macro, or econometrics focus?";
        }
        else if (detectedMajor === 'biology') {
          botResponse = "Biology is fascinating! Here are some courses:\n\n- **BIOL 0200**: The Foundation of Living Systems\n- **BIOL 0470**: Genetics\n- **BIOL 0800**: Principles of Physiology\n- **BIOL 1950**: Advanced Cell Biology\n\nWant to explore molecular, organismal, or ecological biology?";
        }
        else if (detectedMajor === 'psychology') {
          botResponse = "Psychology is so interesting! Here are some courses:\n\n- **CLPS 0010**: Mind, Brain, and Behavior\n- **CLPS 0200**: Social Psychology\n- **CLPS 0450**: Cognitive Psychology\n- **CLPS 0700**: Developmental Psychology\n\nInterested in cognitive, social, or clinical psychology?";
        }
        // General requirements/major questions
        else if (userInput.includes("requirement") || userInput.includes("major") || userInput.includes("core")) {
          botResponse = "To complete most majors, you'll need intro courses, core requirements, and advanced electives. 📚 Do you want a sample 4-year course plan or just the list of requirements for a specific major?";
        }
        // Help/General
        else {
          botResponse = "I'm here to help you find courses! 🎓 Try asking about a department (like 'CSCI', 'MATH', 'ECON', 'BIOL', 'PSYCH'), or about major requirements. You can also ask me about specific course levels or topics!";
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment!",
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <GraduationCap className="w-16 h-16 text-amber-900 mx-auto mb-4" />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {isLoggedIn && userFirstName ? (
                <>
                  Welcome,
                  <span className="text-amber-900 block">{userFirstName}!</span>
                </>
              ) : (
                <>
                  Find Your Perfect
                  <span className="text-amber-900 block">Schedule @ Brown</span>
                </>
              )}
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Optimize your academic journey with our AI-assisted comprehensive course catalog for students at Brown. Make informed
              decisions about your education.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => onNavigate("courses")}
              className="bg-amber-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-800 transition-colors shadow-lg"
            >
              Browse Courses
            </button>
            {!isLoggedIn ? (
              <button
                onClick={() => onNavigate("signup")}
                className="bg-white text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-amber-900 hover:bg-amber-50 transition-colors"
              >
                Sign Up to Chat with BrunoBot
              </button>
            ) : (
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-white text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-amber-900 hover:bg-amber-50 transition-colors flex items-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with BrunoBot
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-amber-900 mb-2">1,200+</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-amber-900 mb-2">40+</div>
              <div className="text-gray-600">Academic Departments</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-3xl font-bold text-amber-900 mb-2">85+</div>
              <div className="text-gray-600">Concentrations Offered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Plan Your Academic Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools and information you need to make informed course selections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-amber-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Search</h3>
              <p className="text-gray-600">
                Find courses by department, professor, keywords, or requirements with our advanced search filters.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-amber-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Schedule Planning</h3>
              <p className="text-gray-600">
                Build and visualize your course schedule to avoid conflicts and optimize your time.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Professor Insights</h3>
              <p className="text-gray-600">Learn about instructors, their teaching styles, and course expectations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-amber-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who use our platform to discover amazing courses and plan their academic
            success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate("courses")}
              className="bg-white text-amber-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Browsing
            </button>
            {!isLoggedIn && (
              <button
                onClick={() => onNavigate("signup")}
                className="bg-transparent text-white px-8 py-4 rounded-lg text-lg font-semibold border-2 border-white hover:bg-white hover:text-amber-900 transition-colors"
              >
                Create Account
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">BrunoTrack</h3>
              <p className="text-gray-400">Your comprehensive guide to Brown University's academic offerings.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <button
                  onClick={() => onNavigate("courses")}
                  className="block text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  Browse Courses
                </button>
                <button
                  onClick={() => onNavigate("schedule")}
                  className="block text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0"
                >
                  My Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>



            {/* Sliding Chat Panel */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isChatOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">BrunoBot</h3>
                  <p className="text-sm opacity-90">AI Course Advisor</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleChatKeyPress}
                placeholder="Ask me about courses..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                disabled={isChatLoading}
              />
              <button
                onClick={handleChatSend}
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage 