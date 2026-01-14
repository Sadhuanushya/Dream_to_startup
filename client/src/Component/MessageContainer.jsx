  import { useEffect } from "react";
  import { useDispatch } from "react-redux";
  export default function MessageContainer(){
    const dispatch=useDispatch();
  useEffect(() => {
    // 1. Initialize Socket.io Connection (Replace URL with your server address)
    socket.current = io('http://localhost:5173/'); 

    socket.current.on('connect', () => {
      dispatch(setOnlineStatus('online'));
      // 2. Register this user with the socket server
      socket.current.emit('register', currentUser.id);
    });

    // Listen for incoming messages
    socket.current.on('receive_message', (message) => {
      dispatch(addMessage(message));
    });

    // Listen for confirmation that our message was saved and delivered
    socket.current.on('message_delivered', (message) => {
      dispatch(addMessage(message));
    });

    // Listen for typing indicator
    socket.current.on('user_typing', ({ senderId }) => {
      if (senderId === receiver.id) {
        dispatch(setTyping(true));
        setTimeout(() => dispatch(setTyping(false)), 3000);
      }
    });

    socket.current.on('disconnect', () => dispatch(setOnlineStatus('offline')));

    // 3. Initial Load: Fetch history via HTTP
    dispatch(fetchMessages({ userId: currentUser.id, otherUserId: receiver.id }));

    return () => {
      socket.current.disconnect();
    };
  }, []);//currentUser.id, receiver.id, dispatch

  // Auto-scroll to latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingStatus]);

  
  }
  
