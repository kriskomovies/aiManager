import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface MessageBubbleProps {
  message: Message;
  isTyping?: boolean;
}

export function MessageBubble({
  message,
  isTyping = false,
}: MessageBubbleProps) {
  const isUser = message.sender === 'user';

  return (
    <motion.div
      className={cn(
        'flex items-start gap-3 mb-4',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex flex-col max-w-[80%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        {/* Message Bubble */}
        <div
          className={cn(
            'px-4 py-2 rounded-lg',
            isUser
              ? 'bg-blue-500 text-white rounded-br-sm'
              : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
          )}
        >
          {isTyping ? (
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          )}
        </div>

        {/* Timestamp */}
        {!isTyping && (
          <span className="text-xs text-gray-500 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </motion.div>
  );
}
