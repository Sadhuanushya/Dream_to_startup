const mongoose = require("mongoose");
const Message = require("../models/MessageChat-model");

const MessageCtrl = {};

/**
 * MESSAGE CONTROLLER
 */

// 1. Send Message (Used for HTTP fallback or direct persistence)
MessageCtrl.sent = async (req, res) => {
    const { senderId, receiverId, text } = req.body;
    try {
        const newMessage = new Message({
            senderId,
            receiverId,
            text
        });
        const savedMessage = await newMessage.save();
        // Added response handling (was missing in your snippet)
        return res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Error saving message:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 2. Get conversation history between two users
MessageCtrl.getmessage = async (req, res) => {
    try {
        const { userId, otherUserId } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
};

// 3. Mark messages as seen
MessageCtrl.seen = async (req, res) => {
    try {
        const { messageId } = req.body;
        const updated = await Message.findByIdAndUpdate(messageId, { seen: true }, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
};

module.exports = MessageCtrl;