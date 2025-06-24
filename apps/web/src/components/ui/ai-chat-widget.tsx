import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageBubble, type Message } from './message-bubble';
import { SuggestionChip } from './suggestion-chip';
import { Button } from './button';
import { Input } from './input';

interface AIChatWidgetProps {
  className?: string;
}

export function AIChatWidget({ className }: AIChatWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Здравейте! Аз съм вашият AI асистент за управление на имоти. Как мога да ви помогна днес?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI response function
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock responses based on user input
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

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const suggestions = [
    'Покажи ми сградите с просрочени плащания',
    'Каки са приходите този месец?',
    'Списък с активни заявки за поддръжка',
    'Колко са свободните апартаменти?',
    'Генерирай месечен отчет',
    'Как да добавя нов наемател?',
  ];

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            key="chat-expanded"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-2xl border border-gray-200 w-96 h-[600px] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI Асистент</h3>
                  <p className="text-xs text-gray-500">Онлайн</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Предложения:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <SuggestionChip
                      key={index}
                      text={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Напишете вашето съобщение..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="chat-collapsed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
} 