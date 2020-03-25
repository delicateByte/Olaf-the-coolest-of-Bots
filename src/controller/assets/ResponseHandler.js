class ResponseHandler {
​
    /**
     * Sends response for Frontend with appropriated status.
     * @param {*} statusCode Status Code (HTTP)
     * @param {*} data Data to be send back to Frontend
     * @param {*} res Response Object
     */
    static sendResponse(statusCode, data, res) {
        res.status(statusCode).send(data);
    }
​
    /**
     *
     * @param {*} data Data to be send back to Frontend.
     * @param {*} res Response Object.
     */
    static success(data, res) {
        this.sendResponse(200, data, res);
    }
​
    /**
     *
     * @param {*} data Data to be send the frontend.
     * @param {*} res Response Object.
     */
    static badRequestError(data, res) {
        this.sendResponse(400, data, res);
    }
​
    /**
     *
     * @param {*} date Data to be send the frontend.
     * @param {*} res Response Object.
     */
    static unauthorizedError(data, res) {
        this.sendResponse(401, data, res);
    }
​
    /**
     *
     * @param {*} data Data to be send the frontend.
     * @param {*} res Response Object.
     */
    static forbiddenError(data, res) {
        this.sendResponse(403, data, res);
    }
​
    /**
     *
     * @param {*} data Data to be send the frontend.
     * @param {*} res Response Object.
     */
    static serverError(data, res) {
        this.sendResponse(500, data, res);
    }
​
    /**
     *
     * @param {*} message
     * @param {*} res
     */
    static databaseError(res) {
        const sql_error = 'There was an error in the request you sent. Please contact bla@bla.com';
        this.serverError(sql_error, res);
    }
​
    /**
     *
     * @param {*} res Response Object.
     */
    static notEnoughRightsError(res) {
        this.forbiddenError("Not enough rights to perform this action.", res);
    }
​
    /**
     *
     * @param {*} res Response Object.
     */
    static badDataError(res) {
        this.badRequestError("Supplied data is bad.", res);
    }
​
    /**
     *
     * @param {*} res Response Object.
     */
    static notEnoughSeats(res) {
        this.badRequestError("This ride already has the maximum number of passengers. Please select another ride.", res);
    }
}
​
module.exports = ResponseHandler;
