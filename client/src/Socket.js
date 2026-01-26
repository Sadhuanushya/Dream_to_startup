import { io } from 'socket.io-client';

// Replace with your actual backend URL
const SOCKET_URL = 'http://localhost:3080'; 

export const socket = io(SOCKET_URL, {
  autoConnect: false, // Prevents connecting before the user is ready
  reconnection: true,
});