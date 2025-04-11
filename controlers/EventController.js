
const eventsmodel = require('..\models\Event.js')

const EventController={
getALLEvents : async (req, res) => {
    try{
    const events = await eventsmodel.find();
    return res.status(200).json(events)
}
    catch(e){
        return res.status(500).json({message:e.message})
    }
  
},
PostEvent: async(req,res)=>{
   
        const Event1 =new eventsmodel({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
            category: req.body.category,
            image: req.body.image,
            ticketPricing: req.body.ticketPricing,
            totalTickets: req.body.totalTickets,
            remainingTickets: req.body.remainingTickets,


        })
        try{
            const newEvent=await Event1.save();
            return res.status(201).json(newEvent);
        }
        catch(e){
            return res.status(500).json({message: e.message})
        }
    },
EditEvent: async(req,res)=>{
    try{
        const Event1=await eventsmodel.findByIdAndUpdate(req.params.id,req.body);
        return res.status(200).json({Event1,message: "Event updated succesfully"});
    }
    catch(e){
        return res.status(500).json({message: e.message});
    }   
},
DeleteEvent: async(req,res)=>{
    try{
        const event1=await eventsmodel.findByIdAndDelete(req.params.id);
        return res.status(200).json({event1,msg:"Event deleted succesfully"});
    }
    catch(error){
        return res.status(500),json({message :error.message})
    }
}


}