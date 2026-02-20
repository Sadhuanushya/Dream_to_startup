const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Story = mongoose.model("Stories", StorySchema);
module.exports = Story; 