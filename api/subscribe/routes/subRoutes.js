const {
    createOrUpdateSubscription,
} = require('../subController');
const { 
    setupSubscriptionSchema,
} = require('./validators/subSchemas');
const express = require('express');
const subRouter = express.Router();
const { checkSchema, validationResult } = require('express-validator');



const checkInputErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (errors && !errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    return next();
}

//POST /subscribe/{topic}
subRouter.route('/:topic')
    .post(
        checkSchema(setupSubscriptionSchema),
        checkInputErrors,
        createOrUpdateSubscription
    );

module.exports = subRouter;