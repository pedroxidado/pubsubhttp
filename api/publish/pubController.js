const Event = require('./models/event');
const Subscriber = require('../subscribe/models/subscriber');
const axios = require('axios');

exports.publishEvent = async (req, res) => {
    console.log('enter publish of events');
    Subscriber.find({topic: req.params.topic})
        .then(async (subscribers) => {
            if(!subscribers){
                //topic not found
                res.status(404).json({ message: `Topic ${req.params.topic} not found` });
            }

            console.log(`Topic exists ${subscribers}`);
            let response = [];

            for(const subscriber of subscribers ){
                console.log(`Reviewing ${subscriber}`);
                await axios.post(subscriber.url, req.body, {
                    params: {
                        source: 'mypubsub'
                    }
                })
                .then((ok) => {
                    console.log(`Success ${ok}`);
                    response.push({
                        status: 'success',
                        reason: 'Event sent',
                        id: subscriber._id,
                        url: subscriber.url
                    });
                })
                .catch((err) => {
                    console.log(`Err ${err}`);
                    response.push({
                        status: 'fail',
                        reason: `Event not sent : ${err}`,
                        id: subscriber._id,
                        url: subscriber.url}
                        );
                });
            }

            console.log(`Response array: ${response}`);

            return response;
        })
        .then((responses) => {
            console.log(responses);
            //create events
            responses.forEach(async (element) => {
                const event = new Event({
                    topic: element.id,
                    status: element.status,
                    reason: element.reason
                });
                try{
                    console.log(`Trying to insert event for Subscription id ${element.id}`);
                    const newEvent = await event.save();
                    console.log(`new Event in db ${newEvent._id}`);
                }catch(err){
                    console.log(`Error inserting event in db ${err.message}`)
                }
            });
            res.status(200).json({ message: 'Events published '});
        })
        .catch((err) => {
            res.status(500).json({ message: err.message })
        });
}