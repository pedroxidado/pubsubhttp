exports.postEvent = async (req, res) => {
    console.log('Received event from TOPIC pubsub');
    console.log(`Body ${req.body}`);
    res.status(200).json({message: 'ok'});
}