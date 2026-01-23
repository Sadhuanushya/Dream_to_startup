import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Send, User, Check, CheckCheck, Loader2, 
  Phone, Video, MoreVertical, MessageSquare, Search, Clock
} from 'lucide-react';
import { socket } from "../Socket";
import { 
  fetchMessages, 
  fetchConversations,
  addMessage, 
  setTyping, 
  setOnlineStatus,
  sendMessages,
 
} from '../Slice/Message-Slice';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
import { fetchUserAccount } from '../Slice/Users-Slice';
import {fetchInvestor} from "../Slice/Investor-Slice"
import {fetchEntrepreneur} from "../Slice/Entreprenuer-Slice"

export default function Message() {

  const dispatch = useDispatch();
  const { messages, conversations, loading, conversationLoading, typingStatus, onlineStatus } = useSelector(state => state.Message);
  const { user } = useContext(UserContext);
  const [inputText, setInputText] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef(null);

  const safeMessages = Array.isArray(messages) ? messages : [];
  
  const currentUser = { id: localStorage.getItem("userId") };
  const receiver = { id: localStorage.getItem("receiverId") };
  console.log("currentUser",currentUser.id);
  console.log("receiver",receiver.id)
console.log("conversations",conversations)
  const filteredConversations = conversations.filter(conv => 
    conv.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
console.log(conversations)
  useEffect(() => {
    socket.connect();
  if (currentUser.id) {
  socket.connect();
  socket.emit('register', currentUser.id);
}

    socket.on('connect', () => dispatch(setOnlineStatus('online')));
    
    socket.on('receive_message', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('user_typing', ({ senderId }) => {
      dispatch(setTyping(true));
      setTimeout(() => dispatch(setTyping(false)), 3000);
    });

    socket.on('disconnect', () => dispatch(setOnlineStatus('offline')));

    // Fetch conversations on mount
    if (currentUser.id) {
      dispatch(fetchConversations(currentUser.id));
    }

    return () => {
      socket.off('connect');
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [currentUser.id, dispatch]);

  // Fetch messages when a conversation is selected
  // 1. Get the receiver profile ID sent from the Investors/Entrepreneurs page
  const reduxReceiverProfileId = localStorage.getItem("receiverId") || null;
  const reduxReceivername = localStorage.getItem("receivername") || null;
  const [actualReceiverId, setActualReceiverId] = useState(null);

  useEffect(() => {
    // 2. If we have a receiver profile ID, we need to get the actual user ID
    if (reduxReceiverProfileId) {
      const fetchActualReceiverId = async () => {
        try {
          const token = localStorage.getItem('token');
          
          // Try to fetch as entrepreneur first
          try {
            const entrepreneurResponse = await fetch(`http://localhost:3080/api/Entrepreneur/${reduxReceiverProfileId}`, {
              headers: { Authorization: token }
            });
            
            if (entrepreneurResponse.ok) {
              const entrepreneurData = await entrepreneurResponse.json();
              // The userId field in entrepreneur profile is the actual user ID
              setActualReceiverId(entrepreneurData.userId);
              return;
            }
          } catch (err) {
            console.log('Not an entrepreneur profile');
          }

          // Try to fetch as investor
          try {
            const investorResponse = await fetch(`http://localhost:3080/api/Investor/${reduxReceiverProfileId}`, {
              headers: { Authorization: token }
            });
            
            if (investorResponse.ok) {
              const investorData = await investorResponse.json();
              // The userId field in investor profile is the actual user ID
              setActualReceiverId(investorData.userId);
              return;
            }
          } catch (err) {
            console.log('Not an investor profile');
          }

          console.error('Could not find user for profile ID:', reduxReceiverProfileId);
        } catch (error) {
          console.error('Error fetching receiver ID:', error);
        }
      };

      fetchActualReceiverId();
    }
  }, [reduxReceiverProfileId]);

  useEffect(() => {
    // 3. Once we have the actual receiver user ID, proceed with messaging
    if (actualReceiverId) {
      dispatch(fetchUserAccount(actualReceiverId));

      const existingConv = conversations.find(c => c.userId === actualReceiverId);

      if (existingConv) {
        setSelectedConversation(existingConv);
      } else {
        // 4. Create a temporary conversation object for the UI to render the chat box
        setSelectedConversation({
          userId: actualReceiverId,
          username: reduxReceivername,
          lastMessage: ""
        });
      }
      
      // 5. Trigger the message fetch for this specific user ID
      dispatch(fetchMessages({ 
        userId: currentUser.id, 
        otherUserId: actualReceiverId 
      }));
    }
  }, [actualReceiverId, conversations, dispatch, currentUser.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingStatus]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConversation || !actualReceiverId) return;

    const msgData = {
      _id: Date.now().toString(),
      senderId: currentUser.id,
      receiverName: reduxReceivername,
      receiverId: actualReceiverId,
      text: inputText,
      createdAt: new Date().toISOString()
    };

    socket.emit('send_message', msgData);
    dispatch(sendMessages(msgData));
    setInputText('');
  };

  const notifyTyping = () => {
    if (selectedConversation) {
      socket.emit('typing', { senderId: currentUser.id, receiverId: selectedConversation.userId });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Messages</h1>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-2xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversationLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <MessageSquare size={40} strokeWidth={1} />
              <p className="text-sm font-medium">No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.userId}
                onClick={() => setSelectedConversation(conv)}
                className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation?.userId === conv.userId
                    ? 'bg-indigo-50 border-l-4 border-l-indigo-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                      {conv.username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate text-sm">{conv.username || 'Unknown'}</p>
                      <p className="text-xs text-gray-500 truncate">{conv.lastMessage || 'No messages'}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                    {formatTime(conv.lastMessageTime)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Chat View */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <header className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                    <User size={24} />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">{selectedConversation.username || 'User'}</h2>
                  <p className="text-xs uppercase font-black tracking-widest text-gray-400">
                    {typingStatus ? <span className="text-indigo-600 animate-pulse italic">typing...</span> : onlineStatus}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all"><Phone size={20} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all"><Video size={20} /></button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-all"><MoreVertical size={20} /></button>
              </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
                  <Loader2 className="animate-spin" size={32} />
                  <p className="text-sm font-medium">Loading conversation...</p>
                </div>
              ) : safeMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-4 opacity-50">
                  <MessageSquare size={64} strokeWidth={1} />
                  <p className="font-medium italic">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                safeMessages.map((msg, index) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg._id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`max-w-xs px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 px-1">
                        <span className="text-xs font-semibold text-gray-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && (
                          <span className={msg.seen ? "text-emerald-500" : "text-gray-300"}>
                            {msg.seen ? <CheckCheck size={14} /> : <Check size={14} />}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={scrollRef} />
            </main>

            {/* Message Input */}
            <footer className="p-6 bg-white border-t border-gray-200">
              <form onSubmit={handleSend} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={notifyTyping}
                  placeholder="Write your message..."
                  className="flex-1 bg-gray-100 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 active:scale-95 transition-all shadow-lg"
                >
                  <Send size={22} />
                </button>
              </form>
            </footer>
          </>
        ) : (
          /* No Conversation Selected */
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 gap-4 text-gray-400">
            <MessageSquare size={64} strokeWidth={1} />
            <p className="text-lg font-medium">Select a conversation to start</p>
            <p className="text-sm">Choose someone from the list to view messages</p>
          </div>
        )}
      </div>
    </div>
  );
}