import { useEffect, useState } from "react";
import { Message } from "../../model/messages";
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { IoChatbox, IoChatboxOutline, IoRefreshCircle } from "react-icons/io5";
import Markdown from "react-markdown";
import Skeleton from "react-loading-skeleton";
import { HiOutlinePencil, HiOutlinePencilAlt } from "react-icons/hi";
import { FiSettings } from "react-icons/fi";
import { ChatHistory } from "../../model/chatHistory";
import { toast } from "react-toastify";

export default function ChatbotPage(){

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSelectedLawIds, setCurrentSelectedLawsIds] = useState<number[]>([101646]);
    const [currentChatHistoryId, setCurrentHistoryId] = useState<number|undefined>()

    const[isMenuOpen,setIsMenuOpen] =useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    const handleChatHistoryClick = (history: ChatHistory) => {
      // Handle chat history click
      fetch(import.meta.env.VITE_BASE_API_URL+"/chat/chat-history/get",{
        method:"POST",
        headers:{
          'Authorization': 'Bearer '+localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({chat_history_id:history.id})
      })
      .then(response => response.json())
      .then(data => {
        setMessages(data.messages.map((msg:any)=>({"role":msg.message_role,"content":msg.content})))
        setCurrentHistoryId(history.id)
      })
    }

    const updateChatHistoryinDatabase = async(msgs:Message[])=>{
      if(!currentChatHistoryId){
        fetch(import.meta.env.VITE_BASE_API_URL+"/chat/chat-history/new",{
          method:"POST",
          headers:{
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({"messages":msgs,"law_ids":currentSelectedLawIds})
      }).then(async (response)=>{
        if(response.ok){
        toast.success("Chat berhasil ditambahkan")
          await reloadChatHistories()
        return response.json()
      } else{
        toast.error("Gagal menambahkan chat")
      }
      }).then(data=>{
        setCurrentHistoryId(data.chat_history_id)
      })
      } else{ // if it is not a new chat
        fetch(import.meta.env.VITE_BASE_API_URL+"/chat/chat-history/update",{
          method:"POST",
          headers:{
            'Authorization': 'Bearer '+localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({"messages":msgs,"chat_history_id":currentChatHistoryId})
      }).then(response=>{
        if(response.ok){
          toast.success("Chat berhasil diperbarui")
        }
        else{
          toast.error("Gagal memperbarui chat")
        }
      })
      }
    }

    const handleClickNewMessage =() => {
      setCurrentHistoryId(undefined);
      setMessages([])
    }
    const [chatHistories, setChatHistories] = useState<ChatHistory[]>([])

    const handleSend = async () => {
      if (input.trim()) {
        setIsLoading(true);
        setInput("");
        const oldMessages = [...messages]
        // Add the user's message
        const humanMessage: Message = { content: input, role: "human" };
        
        setMessages((prevMessages) => [...prevMessages, humanMessage]);
        // Simulate AI response
        try{
        const response = (await fetch(import.meta.env.VITE_BASE_API_URL+"/chat/ask-chatbot",
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
          await updateChatHistoryinDatabase([...oldMessages,humanMessage,aiMessage])
        }else{
          const aiMessage: Message = { content: "Error!"+ await response.text(), role: "ai" };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
          await updateChatHistoryinDatabase([...oldMessages,humanMessage,aiMessage])
        }} catch(error:any){
          throw error;
        } finally{
          console.log(messages)
          
        }


      }
      setIsLoading(false);
    };

    
    const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    };
  
    const reloadChatHistories = async ()=>{
      fetch(import.meta.env.VITE_BASE_API_URL+"/chat/chat-history/list",
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
        setChatHistories(data.map((history:ChatHistory) => history))
      }
      )
    }

    
    useEffect(()=>{
      if (!localStorage.getItem("token")){
        window.location.href = "/auth/login";
      }
      else{
        reloadChatHistories().then(()=>{});
      }
    },[])
  
    return (
      <div className="h-screen flex bg-gray-100">
        {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-ch-coral z-10 shadow-md shadow-black text-white flex h-screen flex-col transition-all duration-300`}
      >
        <div className={`${!isSidebarOpen ? 'hidden':''}`}>
        {/* Toggle Button */}
        <button
          className={`px-4 hover:bg-ch-brick-red h-16 ${!isSidebarOpen && 'hidden'}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {!isSidebarOpen ? <GoSidebarCollapse size={25}/> : <GoSidebarExpand size={25}/>}
        </button>

        {/* Chat History */}
        <div className="flex-1 overflow-y-scroll">
          <p className="p-2 text-justify">Daftar Riwayat Chat</p>
          {chatHistories.map((history, index) => (
            <button
              key={index}
              className={`p-2 w-full hover:bg-ch-brick-red cursor-pointer text-justify ${
                isSidebarOpen ? "text-base" : "text-base"
              }`}
              title={history.title}
              onClick={()=>handleChatHistoryClick(history)}
            >
              {history.title}
            </button>
          ))}
        </div>
      </div>
      </div>
        <div className="flex flex-col flex-1 h-screen">
        {/* Header */}
        <header className=" bg-ch-coral h-16 px-4 text-white text-center flex">
          {!isSidebarOpen &&<button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <GoSidebarCollapse size={25} />
          </button>  }
          <div className="flex-1"/>
          <h1 className="text-2xl font-semibold my-auto">ChatHukum.ai</h1>
          <div className="flex-1"/>
          <div className="flex w-fit">
          <button className=" px-2 py-4 h-full text-white text-center hover:bg-ch-brick-red">
            <HiOutlinePencilAlt size={25} onClick={handleClickNewMessage} />
          </button>
          <button className=" px-2 py-4 h-full text-white text-center hover:bg-ch-brick-red">
            <FiSettings size={25} onClick={()=>{setIsMenuOpen(!isMenuOpen)}} />
          </button>
          </div>
        </header>
        <div id="menu" className={`fixed right-0 top-16 bg-ch-coral rounded-b-md text-left text-white shadow-md w-64 z-10 ${isMenuOpen?'':'hidden'}`}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full px-4 text-left transition-all hover:bg-ch-brick-red  py-2">Edit Daftar Dokumen</button>
          <button onClick={handleLogout} className="w-full px-4 text-left transition-all hover:bg-ch-brick-red py-2">Keluar</button>
        </div>
  
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