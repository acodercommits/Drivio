'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/lib/types';
import { useAuth } from '@/lib/auth/use-auth';

const MESSAGES_STORAGE_KEY = 'hopon-messages';

interface MessageContextType {
  messages: Message[];
  loading: boolean;
  addMessage: (text: string) => void;
  getMessagesForTrip: (tripId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripId, setTripId] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([]));
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to load messages from local storage", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getMessagesForTrip = (currentTripId: string) => {
    setTripId(currentTripId);
  }

  const addMessage = useCallback((text: string) => {
    if (!user || !tripId) return;

    const newMessage: Message = {
      id: uuidv4(),
      tripId,
      userId: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      text,
      timestamp: Date.now(),
    };
    
    setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, newMessage];
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updatedMessages));
        return updatedMessages;
    });

  }, [user, tripId]);


  const value: MessageContextType = { 
      messages: messages.filter(m => m.tripId === tripId), 
      loading, 
      addMessage,
      getMessagesForTrip,
    };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages(tripId: string) {
    const context = useContext(MessageContext);
    if (context === undefined) {
      throw new Error('useMessages must be used within a MessageProvider');
    }
    
    // This is a bit of a hack to set the tripId for the context
    useEffect(() => {
        context.getMessagesForTrip(tripId)
    }, [tripId, context])


    return { messages: context.messages, loading: context.loading, addMessage: context.addMessage };
}
