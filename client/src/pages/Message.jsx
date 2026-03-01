import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  fetchConversations,
  addMessage,
  setTyping,
  setOnlineStatus
} from "../Slice/Message-Slice";
import { socket } from "../Socket";
import {
  Send,
  User,
  Loader2,
  MessageSquare,
  Search
} from "lucide-react";
import "../style/message.css";

export default function Message() {
  const dispatch = useDispatch();
  const {
    messages,
    conversations,
    loading,
    conversationLoading,
    typingStatus,
    onlineStatus
  } = useSelector((state) => state.Message);

  const currentUserId = localStorage.getItem("userId") || "";

  const [inputText, setInputText] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef(null);

  const safeMessages = Array.isArray(messages) ? messages : [];

  const getSenderId = (sender) => {
    if (!sender) return null;
    if (typeof sender === "string") return sender;
    if (sender._id) return sender._id;
    if (sender.userId) return sender.userId;
    return null;
  };

  useEffect(() => {
    if (!currentUserId) return;

    socket.connect();
    socket.emit("register", currentUserId);

    socket.on("connect", () => dispatch(setOnlineStatus("online")));
    socket.on("disconnect", () => dispatch(setOnlineStatus("offline")));
    socket.on("receive_message", (msg) => dispatch(addMessage(msg)));
    socket.on("message_delivered", (msg) => dispatch(addMessage(msg)));

    socket.on("user_typing", () => {
      dispatch(setTyping(true));
      setTimeout(() => dispatch(setTyping(false)), 2500);
    });

    
    dispatch(fetchConversations(currentUserId)).then(() => {
    
      const pendingId = localStorage.getItem("receiverId");
      const pendingName = localStorage.getItem("receivername");

      if (pendingId && pendingName) {
        const newChat = {
          userId: pendingId,
          username: pendingName,
          lastMessage: "Start a conversation..."
        };
     
        setSelectedConversation(newChat);
        dispatch(fetchMessages({ userId: currentUserId, otherUserId: pendingId }));

       
        localStorage.removeItem("receiverId");
        localStorage.removeItem("receivername");
      }
    });

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, [dispatch, currentUserId]);


  const filteredConversations = conversations.filter((conv) =>
    conv.username?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayConversations = [...filteredConversations];
  if (selectedConversation && !displayConversations.find(c => c.userId === selectedConversation.userId)) {
    displayConversations.unshift(selectedConversation);
  }

  const selectChat = (conv) => {
    setSelectedConversation(conv);
    dispatch(fetchMessages({ userId: currentUserId, otherUserId: conv.userId }));
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [safeMessages, typingStatus]);

  const notifyTyping = () => {
    if (!selectedConversation) return;
    socket.emit("typing", { senderId: currentUserId, receiverId: selectedConversation.userId });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConversation) return;

    socket.emit("send_message", {
      senderId: currentUserId,
      receiverId: selectedConversation.userId,
      text: inputText,
      createdAt: new Date().toISOString()
    });

    setInputText("");
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="conversation-list">
          {conversationLoading ? (
            <div className="centered-loader"><Loader2 className="spin" size={28} /></div>
          ) : displayConversations.length === 0 ? (
            <div className="no-conversations">
              <MessageSquare size={40} />
              <p>No chats found</p>
            </div>
          ) : (
            displayConversations.map((conv) => (
              <div
                key={conv.userId}
                className={`conversation-item ${selectedConversation?.userId === conv.userId ? "active" : ""}`}
                onClick={() => selectChat(conv)}
              >
                <div className="conv-avatar">{conv.username?.charAt(0).toUpperCase() || "U"}</div>
                <div className="conv-details">
                  <p className="conv-name">{conv.username}</p>
                  <p className="conv-last">{(conv.lastMessage || "").slice(0, 30)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="chat-main">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <User size={24} className="header-icon" />
              <div className="header-info">
                <p className="header-name">{selectedConversation.username}</p>
                <p className="header-status">{typingStatus ? "typing..." : onlineStatus}</p>
              </div>
            </div>

            <div className="messages-area">
              {loading ? (
                <div className="centered-loader"><Loader2 className="spin" size={30} /></div>
              ) : safeMessages.length === 0 ? (
                <div className="empty-chat">
                  <MessageSquare size={50} />
                  <p>No messages yet. Say hi to {selectedConversation.username}!</p>
                </div>
              ) : (
                safeMessages.map((msg, idx) => {
                  const senderId = getSenderId(msg.senderId);
                  const isMe = senderId === currentUserId;
                  return (
                    <div key={msg._id || idx} className={`message-bubble-container ${isMe ? "sent" : "received"}`}>
                      <div className="message-bubble">{msg.text}</div>
                      <div className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef}></div>
            </div>

            <form className="chat-input-section" onSubmit={handleSend}>
              <input
                type="text"
                className="chat-input"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={notifyTyping}
              />
              <button type="submit" className="chat-send-btn" disabled={!inputText.trim()}>
                <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="empty-select">
            <MessageSquare size={60} />
            <p>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}