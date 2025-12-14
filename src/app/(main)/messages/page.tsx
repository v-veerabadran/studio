
"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Smile } from "lucide-react";
import { cn } from '@/lib/utils';

const messagesData = [
  {
    id: 1,
    sender: "Dr. Evelyn Reed",
    avatar: "https://picsum.photos/seed/doc1/100/100",
    initials: "ER",
    messages: [
      { id: 1, text: "Hi there, just wanted to follow up on your recent test results. Everything looks good. Please continue with your current medication.", sender: "Dr. Evelyn Reed", timestamp: "10:40 AM" },
      { id: 2, text: "That's great news, thank you Dr. Reed!", sender: "You", timestamp: "10:42 AM" },
    ],
    unread: 1,
    timestamp: "10:40 AM"
  },
  {
    id: 2,
    sender: "Westside Medical Clinic",
    avatar: "https://picsum.photos/seed/clinic1/100/100",
    initials: "WM",
    messages: [
      { id: 1, text: "Your appointment with Dr. Carter on Aug 22, 2024 is confirmed. Please arrive 15 minutes early.", sender: "Westside Medical Clinic", timestamp: "Yesterday" }
    ],
    unread: 2,
    timestamp: "Yesterday"
  },
   {
    id: 3,
    sender: "Dr. Ben Carter",
    avatar: "https://picsum.photos/seed/doc2/100/100",
    initials: "BC",
    messages: [
        { id: 1, text: "Your prescription for Dermatology is ready for pickup at the pharmacy.", sender: "Dr. Ben Carter", timestamp: "3 days ago" }
    ],
    unread: 0,
    timestamp: "3 days ago"
  }
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(messagesData[0]);

  return (
    <div className="container py-8 h-[calc(100vh-8rem)] flex flex-col">
        <h1 className="text-3xl font-bold mb-8">Messages</h1>
        <Card className="flex flex-grow overflow-hidden">
            <div className="w-1/3 border-r">
                <div className="p-4 border-b">
                    <Input placeholder="Search messages..." />
                </div>
                <div className="overflow-y-auto">
                    {messagesData.map(convo => (
                        <div key={convo.id} 
                             className={cn("p-4 flex items-center gap-4 cursor-pointer hover:bg-accent", selectedConversation.id === convo.id && "bg-accent")}
                             onClick={() => setSelectedConversation(convo)}>
                            <Avatar>
                                <AvatarImage src={convo.avatar} alt={convo.sender} data-ai-hint="person portrait" />
                                <AvatarFallback>{convo.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <div className="flex justify-between">
                                    <p className="font-semibold">{convo.sender}</p>
                                    <p className="text-xs text-muted-foreground">{convo.timestamp}</p>
                                </div>
                                <p className={cn("text-sm text-muted-foreground truncate", convo.unread > 0 && "font-bold text-foreground")}>
                                  {convo.messages[convo.messages.length - 1].text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-2/3 flex flex-col">
                <div className="p-4 border-b flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.sender} data-ai-hint="person portrait" />
                        <AvatarFallback>{selectedConversation.initials}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold text-lg">{selectedConversation.sender}</p>
                </div>
                <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-muted/20">
                   {selectedConversation.messages.map(msg => (
                        <div key={msg.id} className={cn("flex items-end gap-2", msg.sender === 'You' ? 'justify-end' : 'justify-start')}>
                             {msg.sender !== 'You' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.sender} data-ai-hint="person portrait" />
                                    <AvatarFallback>{selectedConversation.initials}</AvatarFallback>
                                </Avatar>
                            )}
                            <div className={cn("rounded-lg px-4 py-2 max-w-sm", msg.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-background')}>
                                <p>{msg.text}</p>
                                <p className="text-xs text-muted-foreground mt-1 text-right">{msg.timestamp}</p>
                            </div>
                        </div>
                   ))}
                </div>
                <div className="p-4 border-t bg-background">
                    <div className="relative">
                        <Input placeholder="Type your message..." className="pr-28" />
                        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center">
                            <Button variant="ghost" size="icon"><Smile /></Button>
                            <Button variant="ghost" size="icon"><Paperclip /></Button>
                            <Button><Send /></Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </div>
  );
}
