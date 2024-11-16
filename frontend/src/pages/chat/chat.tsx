import { useEffect, useState } from "react";
import { Message } from "../../model/messages";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { IoChatbox, IoChatboxOutline, IoRefreshCircle } from "react-icons/io5";
import Markdown from "react-markdown";
import Skeleton from "react-loading-skeleton";
import { HiOutlinePencil, HiOutlinePencilAlt } from "react-icons/hi";

export default function ChatbotPage(){

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNewChat, setIsNewChat] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSelectedLawIds, setCurrentSelectedLawsIds] = useState<number[]>([101646]);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    const handleChatHistoryClick = (history: string) => {
      // Handle chat history click
    }
    const handleClickNewMessage =() => {
      setIsNewChat(true);
      setMessages([])
    }
    const [chatHistories, setChatHistories] = useState<string[]>(["History 1", "History 2", "History 3" ,"History 4"])

    const handleSend = async () => {
      if (input.trim()) {
        setIsLoading(true);
        setInput("");
        // Add the user's message
        const humanMessage: Message = { content: input, role: "human" };
        setMessages((prevMessages) => [...prevMessages, humanMessage]);
        // Simulate AI response
        const response =await (await fetch(import.meta.env.VITE_BASE_API_URL+"/chat/ask-chatbot",
          {
            method: "POST",
            body: JSON.stringify({
              question: humanMessage.content,
              law_ids: currentSelectedLawIds,
              chat_history: messages[messages.length-1]??[]
            }),
            headers: {
              "Content-Type": "application/json",
            }
          }));
        if(response.ok){
          const aiMessage: Message = { content: await response.json(), role: "ai" };
          setMessages((prevMessages) => [...prevMessages,aiMessage]);
        }else{
          const aiMessage: Message = { content: "Error!"+ await response.text(), role: "ai" };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        }
      
        setIsNewChat(false);
        setIsLoading(false);
      }
    };

    useEffect(()=>{
      if (!localStorage.getItem("token")){
        window.location.href = "/auth/login";
      }
      else{
        const response = fetch(import.meta.env.VITE_BASE_API_URL+"/chat/chat-history/list",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => response.json())
        .then((data) => {
          setChatHistories(data.map((history:any) => history.title))
        }
        )
      }
    },[])
  
    return (
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-ch-coral z-10 shadow-md shadow-black text-white flex h-screen flex-col transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          className={`px-8 hover:bg-ch-brick-red h-16 ${!isSidebarOpen && 'hidden'}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {!isSidebarOpen ? <GoSidebarCollapse size={25}/> : <GoSidebarExpand size={25}/>}
        </button>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <p className="p-2 text-justify">Daftar Riwayat Chat</p>
          {chatHistories.map((history, index) => (
            <button
              key={index}
              className={`p-2 w-full hover:bg-ch-brick-red cursor-pointer text-justify ${
                isSidebarOpen ? "text-base" : "text-base"
              }`}
              title={history}
            >
              {history}
            </button>
          ))}
        </div>
      </div>
        <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <header className=" bg-ch-coral px-8 text-white text-center py-4 flex">
          {!isSidebarOpen &&<button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <GoSidebarCollapse size={25} />
          </button>  }
          <div className="flex-1"/>
          <h1 className="text-2xl font-semibold">ChatHukum.ai</h1>
          <div className="flex-1"/>
          <button className="px-8 text-white text-center">
            <HiOutlinePencilAlt size={25} onClick={handleClickNewMessage} />
          </button>
          
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
                <Markdown className={' text-justify'}>
                  {message.content}
                </Markdown>  
                </div>
              </div>
            ))}
            {
              isLoading && <div className='flex justify-start items-center'>
                <div className="w-64 flex px-4 py-2 rounded-lg  text-wrap bg-gray-300">
                  <p className="w-full py-2"><Skeleton baseColor="#A9A9A9" count={5}/></p>
                </div>
              </div>
            }
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
              onKeyDown={async(e) => {
                if (e.key === 'Enter') {
                  if(input.trim() === '') return;
                  if(isLoading) return;
                  await handleSend();
                }
              }}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-ch-coral text-white rounded-lg hover:bg-ch-brick-red disabled:bg-gray-300 transition-all"
              disabled={isLoading || input.trim() === ''}
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
      </div>
    );
}