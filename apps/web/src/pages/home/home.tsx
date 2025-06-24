import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch } from '@/redux/hooks';
import { setPageInfo } from '@/redux/slices/app-state';
import { SuggestionChip } from '@/components/ui/suggestion-chip';

import { Input } from '@/components/ui/input';
import { MessageBubble, type Message } from '@/components/ui/message-bubble';
import { Building2, DollarSign, Wrench, FileText, Users, MessageCircle, Send, X } from 'lucide-react';

export function HomePage() {
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    dispatch(setPageInfo({
      title: 'Начало',
      subtitle: 'Добре дошли в Home Manager'
    }));
  }, [dispatch]);

  // Mock AI response function
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('сграда') || lowerMessage.includes('building')) {
      return 'В момента имате 24 сгради в системата. 3 от тях имат неплатени задължения. Искате ли да видите детайлите?';
    } else if (lowerMessage.includes('плащане') || lowerMessage.includes('payment')) {
      return 'Общо са получени 45,230 лв. през този месец. Има 8 неплатени сметки на обща стойност 3,450 лв. Мога да генерирам пълен отчет ако желаете.';
    } else if (lowerMessage.includes('поддръжка') || lowerMessage.includes('maintenance')) {
      return 'Има 12 активни заявки за поддръжка. 3 са с висок приоритет и чакат одобрение. Искате ли да прегледате най-спешните?';
    } else if (lowerMessage.includes('отчет') || lowerMessage.includes('report')) {
      return 'Мога да генерирам различни отчети: месечни приходи, статус на плащанията, заявки за поддръжка, заетост на апартаментите. Кой тип отчет ви интересува?';
    } else if (lowerMessage.includes('помощ') || lowerMessage.includes('help')) {
      return 'Ето някои неща, с които мога да помогна:\n\n• Проверка на финансово състояние\n• Управление на сгради и апартаменти\n• Следене на заявки за поддръжка\n• Генериране на отчети\n• Информация за наематели\n\nПросто ме попитайте!';
    } else {
      return 'Разбирам вашата заявка. В момента анализирам данните от базата ви. Мога да предоставя информация за сгради, плащания, поддръжка и отчети. Можете ли да бъдете по-конкретни за това, което търсите?';
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputValue);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Извинявам се, възникна грешка. Моля опитайте отново.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const suggestionCategories = [
    {
      id: 'financial',
      title: 'Финансов анализ',
      icon: DollarSign,
      color: 'bg-green-50 text-green-700 border-green-200',
      suggestions: [
        'Покажи ми приходите този месец',
        'Кои сгради имат неплатени задължения?',
        'Каква е общата сума от неплатените сметки?',
        'Генерирай финансов отчет за последните 3 месеца'
      ]
    },
    {
      id: 'buildings',
      title: 'Управление на сгради',
      icon: Building2,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      suggestions: [
        'Колко апартамента са свободни в момента?',
        'Покажи статуса на всички сгради',
        'Кои сгради имат най-много проблеми?',
        'Списък с всички наематели в сграда А'
      ]
    },
    {
      id: 'maintenance',
      title: 'Заявки за поддръжка',
      icon: Wrench,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      suggestions: [
        'Покажи всички активни заявки за ремонт',
        'Кои са най-спешните поправки?',
        'Колко заявки са решени този месец?',
        'Създай нова заявка за поддръжка'
      ]
    },
    {
      id: 'reports',
      title: 'Отчети и анализи',
      icon: FileText,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      suggestions: [
        'Генерирай месечен отчет за всички сгради',
        'Анализ на платежните модели',
        'Отчет за заетостта на апартаментите',
        'Сравни приходите с миналата година'
      ]
    },
    {
      id: 'tenants',
      title: 'Управление на наематели',
      icon: Users,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      suggestions: [
        'Добави нов наемател в системата',
        'Покажи информация за наемател',
        'Кои наематели имат изтичащи договори?',
        'История на плащанията на наемател'
      ]
    }
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleCloseCategory = () => {
    setSelectedCategory(null);
  };

  const hasConversation = messages.length > 0;

  return (
    <motion.div
      className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Messages Area */}
      {hasConversation && (
        <motion.div 
          className="w-full flex-1 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-h-[60vh] overflow-y-auto space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && (
              <MessageBubble
                message={{
                  id: 'typing',
                  text: '',
                  sender: 'ai',
                  timestamp: new Date(),
                }}
                isTyping={true}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* Welcome Section - Only show when no conversation */}
      {!hasConversation && (
        <>
          {/* Category Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 w-full"
            variants={itemVariants}
          >
            {suggestionCategories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <motion.div
                  key={category.id}
                  className={`
                    p-6 rounded-xl border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? category.color + ' shadow-lg scale-105' 
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                  onClick={() => handleCategorySelect(category.id)}
                  whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center mb-3">
                    <IconComponent className={`w-5 h-5 mr-2 ${isSelected ? '' : 'text-gray-500'}`} />
                    <h3 className={`font-semibold ${isSelected ? '' : 'text-gray-900'}`}>
                      {category.title}
                    </h3>
                  </div>
                  <p className={`text-sm ${isSelected ? 'opacity-90' : 'text-gray-600'}`}>
                    Натиснете за да видите примери
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Suggestions */}
          <AnimatePresence mode="wait">
            {selectedCategory && (
              <motion.div
                key="suggestions"
                className="w-full mb-8"
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ 
                  duration: 0.3,
                  ease: "easeInOut"
                }}
              >
                <motion.div 
                  className="bg-gray-50 rounded-xl p-6 border border-gray-200 relative overflow-hidden"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Close button */}
                  <motion.button
                    onClick={handleCloseCategory}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-gray-200 flex items-center justify-center transition-colors duration-200 text-gray-500 hover:text-gray-700 z-10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ delay: 0.1 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>

                  <motion.div 
                    className="flex items-center mb-4 pr-10"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.1 }}
                  >
                    <MessageCircle className="w-5 h-5 text-gray-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Примерни въпроси:</h4>
                  </motion.div>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {suggestionCategories
                      .find(cat => cat.id === selectedCategory)
                      ?.suggestions.map((suggestion, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ 
                            delay: 0.3 + (index * 0.05),
                            duration: 0.2 
                          }}
                        >
                          <SuggestionChip
                            text={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="justify-start text-left p-4 bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300"
                          />
                        </motion.div>
                      ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Chat Input - Always visible at bottom */}
      <motion.div 
        className="w-full max-w-4xl"
        variants={itemVariants}
      >
        <div className="relative group">
          <div className="flex items-center bg-white border border-gray-200 rounded-3xl px-6 py-4">
            {/* Input field */}
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Задайте въпрос..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none focus:shadow-none focus-visible:ring-0 focus-visible:outline-none shadow-none text-lg placeholder:text-gray-400 font-normal h-auto py-0"
            />

            {/* Send button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              className={`ml-3 h-8 w-8 rounded-full text-white flex items-center justify-center transition-colors duration-200 ${
                inputValue.trim() 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-gray-400 hover:bg-gray-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Send className="w-4 h-4 text-white fill-current" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 