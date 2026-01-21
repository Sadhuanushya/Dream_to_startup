const mongoose = require("mongoose");
const Message = require("../models/MessageChat-model");

const MessageCtrl = {};

/**
 * MESSAGE CONTROLLER
 */

// 1. Send Message (Used for HTTP fallback or direct persistence)
// MessageCtrl.sent = async (req, res) => {
//     const { senderId, receiverId, text } = req.body;
//     try {
//         const newMessage = new Message({
//             senderId,
//             receiverId,
//             text
//         });
//         const savedMessage = await newMessage.save();
//         // Added response handling (was missing in your snippet)
//         return res.status(201).json(savedMessage);
//     } catch (error) {
//         console.error("Error saving message:", error);
//         return res.status(500).json({ error: "Internal Server Error" });
//     }
// };
MessageCtrl.sent = async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  try {
    const message = await Message.create({
      senderId: new mongoose.Types.ObjectId(senderId),
      receiverId: new mongoose.Types.ObjectId(receiverId),
      text,
      seen: false
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "username email")
      .populate("receiverId", "username email");

    console.log("POPULATED MESSAGE:", populatedMessage);
    console.log("receiverid",receiverId)

    return res.status(201).json(populatedMessage);
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

// 3. Get all conversations for a user (list of people they've messaged with)
MessageCtrl.getConversations = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Get all unique conversations for this user
        const conversations = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: new mongoose.Types.ObjectId(userId) },
                        { receiverId: new mongoose.Types.ObjectId(userId) }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", new mongoose.Types.ObjectId(userId)] },
                            "$receiverId",
                            "$senderId"
                        ]
                    },
                    lastMessage: { $last: "$$ROOT" },
                    lastMessageTime: { $last: "$createdAt" }
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    userId: "$_id",
                    username: "$userDetails.username",
                    email: "$userDetails.email",
                    avatar: "$userDetails.avatar",
                    lastMessage: "$lastMessage.text",
                    lastMessageTime: 1,
                    lastMessageSenderId: "$lastMessage.senderId"
                }
            }
        ]);

        res.status(200).json(conversations);
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ error: "Failed to fetch conversations" });
    }
};

// 4. Mark messages as seen
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