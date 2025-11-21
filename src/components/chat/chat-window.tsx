"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/use-auth";
import { useMessages } from "@/hooks/use-messages";
import type { Message } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface ChatWindowProps {
  tripId: string;
}

export function ChatWindow({ tripId }: ChatWindowProps) {
  const { user } = useAuth();
  const { messages, addMessage, loading } = useMessages(tripId);
  const [newMessage, setNewMessage] = useState("");
  
  const getAvatar = (avatarId: string) => {
    return PlaceHolderImages.find(p => p.id === avatarId);
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      addMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  if (loading) {
    return <div>Loading chat...</div>
  }

  return (
    <div className="border rounded-lg bg-secondary/50">
      <ScrollArea className="h-72 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                message.userId === user?.id ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.avatarUrl} alt={message.name} />
                <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "max-w-xs md:max-w-md rounded-lg p-3",
                  message.userId === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card"
                )}
              >
                <p className="text-sm font-semibold">{message.name}</p>
                <p className="text-sm">{message.text}</p>
                 <p className="text-xs text-right mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground">No messages yet. Start the conversation!</p>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            autoComplete="off"
            disabled={!user}
          />
          <Button type="submit" size="icon" className="flex-shrink-0" disabled={!user}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
