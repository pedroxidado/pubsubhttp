const {
    postEvent,
} = require('../eventController');
const { 
    testEventSchema,
} = require('./validators/eventSchema');
const express = require('express');
const pubRouter = express.Router();
const { checkSchema, validationResult } = require('express-validator');



const checkInputErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (errors && !errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
}

//POST /subscribe/{topic}
pubRouter.route('/')
    .post(
        checkSchema(testEventSchema),
        checkInputErrors,
        postEvent
    );

module.exports = pubRouter;
//https://dev.to/jay97/docker-compose-an-express-and-mongo-app-aai
//https://itnext.io/dockerize-a-node-js-app-connected-to-mongodb-64fdeca94797
//https://itnext.io/dockerize-a-node-js-app-with-vs-code-bd471710dc22