import { Router } from "express";
import ScoreCard from "../models/ScoreCard";

const router = Router();

router.delete("/cards", async(req,res) => {
    await ScoreCard.deleteMany({});
    res.json({message: "Database cleared"})
});

router.post("/card", async(req,res) => 
                    {
                        const existing = await ScoreCard.findOne({name: req.body.name, subject: req.body.subject});
                        if(!existing){
                            await ScoreCard.create(req.body)
                            res.json({message: "Adding: (" + req.body.name + ", " + req.body.subject + ", " + req.body.score + ")", card: true})
                        }
                        else{
                            existing.score = req.body.score
                            await existing.save()
                            res.json({message: "Updating: (" + req.body.name + ", " + req.body.subject + ", " + req.body.score + ")", card: true})
                        }
                    });

router.get("/cards", async(req,res) => {
    let records
    const search = req.query.type
    const type = search === "name" ? "Name" : "Subject"
    var messages = []
    if(search === "name"){
        records = await ScoreCard.find({name : req.query.queryString});
    }

    else if(search === "subject"){
        records = await ScoreCard.find({subject : req.query.queryString});
    }

    for(var i = 0; i < records.length; i++){
        const message = "Found card with " + type + ": (" + records[i].name + ", " + records[i].subject + ", " + records[i].score + ")"
        messages = [...messages, message]
    }
    res.json({messages: messages.length ? messages : undefined, message: !messages.length ? search + " (" + req.query.queryString + ") not found!" : ""})
});
export default router;