const testEventSchema = {
    message: {
        in: ['body'],
        notEmpty: true,
        errorMessage: 'MESSAGE should be defined and a non empty string',
        isString: true,
    },
    source: {
        in: ['query'],
        notEmpty: true,
        isString: true,
        errorMessage: 'Source should be a non empty string defined as a params of the request',
        matches: {
            options: [/^(mypubsub)$/],
        }
    }
};

module.exports = {
    testEventSchema
}