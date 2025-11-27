const ReviewAi = require("../controllers/ReviewAi-controller")

module.exports.getResponse = async (req, res)=>{
    const summary = req.body.summary;

    if(!summary){
        return res.status(400).json({error: "summary is required"})
    }
    const response = await ReviewAi(summary)

    res.send(response);
}