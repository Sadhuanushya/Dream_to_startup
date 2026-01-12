const Message = require("../models/MessageChat-model");

const Socket = (io) => {
    // Map to store userId -> socketId
    const onlineUsers = new Map();

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        // User registers when they open the app
        socket.on("register", (userId) => {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        // Handling the message sending event
        socket.on("send_message", async (data) => {
            const { senderId, receiverId, text } = data;

            try {
                // Save to Database
                const newMessage = new Message({ senderId, receiverId, text });
                const savedMessage = await newMessage.save();

                // Get receiver's socket ID
                const receiverSocketId = onlineUsers.get(receiverId);

                // If receiver is online, emit to them
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", savedMessage);
                }

                // Emit back to sender to confirm delivery
                socket.emit("message_delivered", savedMessage);

            } catch (err) {
                console.error("Socket Message Error:", err);
                socket.emit("error", "Message could not be sent");
            }
        });

        // Typing event
        socket.on("typing", ({ senderId, receiverId }) => {
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("user_typing", { senderId });
            }
        });

        socket.on("disconnect", () => {
            // Remove user from online map on disconnect
            for (let [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            console.log("User disconnected");
        });
    });
};

module.exports = Socket;