
const eventsmodel = require('../models/Event')

const EventController={
getALLApprovedEvents : async (req, res) => {
    try{
    const events = await eventsmodel.find({status:"approved"});
    return res.status(200).json(events)
}
    catch(e){ 
        return res.status(500).json({message:e.message})
    }
  
},
getALLEvents : async (req, res) => {
    try{
    const events = await eventsmodel.find();
    return res.status(200).json(events)
}
    catch(e){ 
        return res.status(500).json({message:e.message})
    }
  
},
getEvent:async(req,res)=>{
    try{
        const event=await eventsmodel.findById(req.params.id);
        return res.status(200).json(event)
    }
    catch(e){
        return res.status(500).json({message:e.message})
    }
},

getUserEvent: async(req,res)=>{
    try{
        const events = await eventsmodel.find({organizer: req.user.id});
        if(!events || events.length === 0){
            return res.status(404).json({message: "No events found"})
        }
        return res.status(200).json(events);

    }catch(e){
        return res.status(500).json({message: e.message})
    }
},
PostEvent: async (req, res) => {
    const organizerId = req.body.organizer?.id || req.body.organizer; // Handle both formats

    const Event1 = new eventsmodel({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        category: req.body.category,
        image: req.body.image,
        ticketPricing: req.body.ticketPricing,
        totalTickets: req.body.totalTickets,
        remainingTickets: req.body.remainingTickets,
        organizer: organizerId, // Use the extracted organizer ID
        createdAt: req.body.createdAt,
        status: req.body.status,
    });

    try {
        const newEvent = await Event1.save();
        return res.status(201).json(newEvent);
    } catch (e) {
        return res.status(500).json({ message: e.message });
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
},
    getAnalytics: async (req, res) => {
    try {
        // Fetch events created by the current organizer
        const events = await eventsmodel.find({ organizer: req.user.id });
        
        if (!events || events.length === 0) {
            return res.status(404).json({ message: "No events found for this organizer." });
        }

        // Map through the events and calculate analytics data
        const analyticsData = events.map(event => ({
            title: event.title,
            bookedPercentage: event.totalTickets > 0
                ? ((event.totalTickets - event.remainingTickets) / event.totalTickets) * 100
                : 0, // Avoid division by zero
        }));

        return res.status(200).json(analyticsData);
    } catch (error) {
        console.error("Error in getAnalytics:", error.message); // Log the error for debugging
        return res.status(500).json({ message: error.message });
    }
},

statusEvent: async (req, res) => {
    try {
        const vstatus = ['approved', 'pending', 'declined'];
        const nstatus = req.body.status;

        if (!vstatus.includes(nstatus)) {
            return res.status(400).json({ message: "Invalid status." });
        }

        const uEvents = await eventsmodel.findByIdAndUpdate(req.params.id,{ status: nstatus },{ new: true });

        if (!uEvents) {
            return res.status(404).json({ message: "Event not found." });
        }

        return res.status(200).json({ uEvents, msg: "Event status updated successfully" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

}
module.exports = EventController;


