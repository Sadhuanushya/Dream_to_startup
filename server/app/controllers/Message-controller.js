
const Message = require("../models/MessageChat-model");

module.exports = {

  addMessage: async (req, res) => {
    try {
      const { from, to, message } = req.body;
      const data = await Message.create({
        message: { text: message },
        users: [from, to],
        sender: from
      });

      if (!data) {
        return res.status(500).json({ msg: "Failed to add message to the database" });
      }
     res.status(201).json({ msg: "Message added successfully." });
    } catch (err) {
      res.status(500).json({error:err})
    }
  },

  getAllMessage: async (req, res) => {
    try {
      const { from, to } = req.query; 

      if (!from || !to) {
          return res.status(400).json({ msg: "Missing 'from' or 'to' user IDs in query." });
      }

      const messages = await Message.find({
        users: { $all: [from, to] }
      })
        .sort({ updatedAt: 1 });

      const projectMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text
        };
      });

      return res.status(200).json(projectMessages);
    } catch (err) {
      res.status(500).json({error:err})
    }
  }
};