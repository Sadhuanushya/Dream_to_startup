import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Send, User, Check, CheckCheck, Loader2, 
  Phone, Video, MoreVertical, MessageSquare 
} from 'lucide-react';
import { socket } from "../Socket";
import { 
  fetchMessages, 
  addMessage, 
  setTyping, 
  setOnlineStatus,
  sendMessages
} from '../Slice/Message-Slice';
import { useContext } from 'react';
import UserContext from '../Context/UserContext';
export default function Message() {
  const dispatch = useDispatch();
  const { messages, loading, typingStatus, onlineStatus,setReceiver } = useSelector(state => state.Message);
  const { senderId } = useContext(UserContext);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);
const safeMessages = Array.isArray(messages) ? messages : [];
  const currentUser = { id:localStorage.getItem("senderId") };
  const receiver = {id:localStorage.getItem("receiverId") };
  console.log("final","cu",currentUser,"re",receiver)

  useEffect(() => {
    socket.connect();
    socket.emit('register', currentUser.id);

    socket.on('connect', () => dispatch(setOnlineStatus('online')));
    
    socket.on('receive_message', (message) => {
      dispatch(addMessage(message));
    });

    socket.on('user_typing', ({ senderId }) => {
      if (senderId === receiver.id) {
        dispatch(setTyping(true));
        setTimeout(() => dispatch(setTyping(false)), 3000);
      }
    });

    socket.on('disconnect', () => dispatch(setOnlineStatus('offline')));

    dispatch(fetchMessages({ userId: currentUser.id, otherUserId: receiver.id }));

    return () => {
      socket.off('connect');
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('disconnect');
      socket.disconnect();
    };
  }, [currentUser.id, receiver.id, dispatch]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingStatus]);

  const handleSend = (e) => {
    console.log("handle send working")
    e.preventDefault();
    // if (!inputText.trim()) return;

    const msgData = {
      _id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: receiver.id,
      text: inputText,
      createdAt: new Date().toISOString()
    };

    socket.emit('send_message', msgData);
    dispatch(sendMessages(msgData));
    setInputText('');
  };

  const notifyTyping = () => {
    socket.emit('typing', { senderId: currentUser.id, receiverId: receiver.id });
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto bg-slate-50 border-x border-slate-200 shadow-2xl">
      <header className="bg-white px-5 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <User size={24} />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg leading-none mb-1">name</h2>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">
              {typingStatus ? <span className="text-indigo-600 animate-pulse italic">typing...</span> : onlineStatus}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all"><Phone size={20}/></button>
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all"><Video size={20}/></button>
          <button className="p-2 hover:bg-slate-100 rounded-xl transition-all"><MoreVertical size={20}/></button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm font-medium">Loading conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-4 opacity-50">
            <MessageSquare size={64} strokeWidth={1} />
            <p className="font-medium italic">No messages yet. Say hi!</p>
          </div>
        ) : (
         safeMessages.map((msg, index) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg._id || index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 px-1">
                   <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <span className={msg.seen ? "text-emerald-500" : "text-slate-300"}>
                      {msg.seen ? <CheckCheck size={14}/> : <Check size={14}/>}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </main>

      <footer className="p-5 bg-white border-t border-slate-100">
        <form onSubmit={handleSend} className="flex gap-3 items-center">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={notifyTyping}
            placeholder="Write your message..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 active:scale-95 transition-all shadow-xl shadow-indigo-100"
          >
            <Send size={22} />
          </button>
        </form>
      </footer>
    </div>
  );
}