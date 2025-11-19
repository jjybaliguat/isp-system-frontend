"use client"

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function ChatUI({ user, messages, onSend }: {user: any, messages: any, onSend: (text: string) => {}}) {
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-full grid grid-rows-[auto_1fr_auto] bg-white dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b dark:border-neutral-800 flex items-center gap-3 bg-muted/30 dark:bg-neutral-800/40">
        <Avatar>
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.fullName?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">{user?.fullName}</p>
          <p className="text-xs text-muted-foreground dark:text-neutral-400">Online</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="p-4 dark:bg-neutral-900">
        <div className="flex flex-col gap-3">
          {messages?.map((msg: any) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.senderId === user.id ? "justify-end" : "justify-start"
              )}
            >
              <Card
                className={cn(
                  "max-w-xs p-3 rounded-2xl",
                  msg.senderId === user.id
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-none"
                )}
              >
                <CardContent className="p-0 text-sm">{msg?.content}</CardContent>
              </Card>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t dark:border-neutral-800 bg-muted/20 dark:bg-neutral-800 flex items-center gap-2">
        <Input
          placeholder="Type a message..."
          className="dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              onSend(text);
              setText("");
            }
          }}
        />
        <Button
          onClick={() => {
            if (!text.trim()) return;
            onSend(text);
            setText("");
          }}
        >
          Send
        </Button>
      </div>
    </div>
  );
}