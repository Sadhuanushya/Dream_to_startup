import { io } from 'socket.io-client';

// Replace with your actual backend URL
const SOCKET_URL = 'http://localhost:5173/'; 

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Prevents connecting before the user is ready
  reconnection: true,
});