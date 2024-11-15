import { useState } from "react";
import { Message } from "../../model/messages";

export default function ChatbotPage(){
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
  
    const handleSend = () => {
      if (input.trim()) {
        // Add the user's message
        const humanMessage: Message = { content: input, role: "human" };
        setMessages((prevMessages) => [...prevMessages, humanMessage]);
  
        // Simulate AI response
        const aiMessage: Message = {
          content: "This is a response from the AI.",
          role: "ai",
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
  
        setInput("");
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        {/* Header */}
        <header className=" bg-ch-coral text-white text-center py-4">
          <h1 className="text-2xl font-semibold">ChatHukum.ai</h1>
        </header>
  
        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "human" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs flex px-4 py-2 rounded-lg  text-wrap ${
                    message.role === "human"
                      ? " bg-ch-soft-red text-white"
                      : "bg-gray-300 text-black"
                  }`}
                >
                <p className=" ">
                  {message.content}
                </p>  
                </div>
              </div>
            ))}
          </div>
        </div>
  
        {/* Input bar */}
        <div className="bg-white border-t border-gray-300 p-4">
          <div className="flex items-center space-x-2">
            <textarea
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ch-coral resize-none"
              placeholder="Type your message..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-ch-coral text-white rounded-lg hover:bg-ch-brick-red"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    );
}