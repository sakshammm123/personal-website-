"use client";

import dynamic from "next/dynamic";

const ChatbotWidget = dynamic(() => import("@/components/ChatbotWidget"), {
  ssr: false,
  loading: () => null
});

export default function ChatbotWidgetWrapper() {
  return <ChatbotWidget />;
}
