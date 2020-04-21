const Subscriber = require('./models/subscriber');

exports.createOrUpdateSubscription = async (req, res) => {
    const subscriber = new Subscriber({
        topic: req.params.topic,
        url: req.body.url
    });

    try{
        const newSubscriber = await subscriber.save();
        res.status(201).json(newSubscriber);
    }catch(err){
        res.status(500).json({ message: err.message })
    }
}