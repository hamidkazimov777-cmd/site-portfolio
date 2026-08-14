"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import type { Contact } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MessagesPage() {
  const [messages, setMessages] = useState<Contact[] | null>(null);

  async function load() {
    const res = await fetch("/api/admin/messages");
    setMessages(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string, read: boolean) {
    setMessages((prev) => prev?.map((m) => (m.id === id ? { ...m, read } : m)) ?? null);
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
  }

  async function remove(id: string) {
    setMessages((prev) => prev?.filter((m) => m.id !== id) ?? null);
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
  }

  return (
    <div>
      <h1 className="text-2xl font-medium text-foreground">Сообщения</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Заявки из формы обратной связи.
      </p>

      <div className="mt-8 space-y-3">
        {messages?.length === 0 && (
          <p className="text-sm text-muted-foreground">Пока нет сообщений.</p>
        )}
        {messages?.map((message) => (
          <Card key={message.id} className={message.read ? "opacity-70" : undefined}>
            <CardContent
              className="cursor-pointer p-5"
              onClick={() => markRead(message.id, !message.read)}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {message.name}{" "}
                    <span className="font-normal text-muted-foreground">
                      &lt;{message.email}&gt;
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {format(message.createdAt, "PPP p")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(message.id);
                  }}
                >
                  <Trash2 className="size-4 text-red-400" />
                </Button>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">
                {message.message}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
