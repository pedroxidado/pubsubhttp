const publishEventSchema = {
    message: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'MESSAGE should be defined and a non empty string',
        isString: true,
    },
    topic: {
        in: ['params'],
        notEmpty: true,
        isString: true,
        errorMessage: 'TOPIC should be a non empty string defined as a params of the request'
    }
};

module.exports = {
    publishEventSchema
}