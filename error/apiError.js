class ApiError extends Error{
    constructor(status, massage){
        super();
        this.status = status;
        this.message = massage;
    }

    static badRequest(massage){
        return new ApiError(400, massage)
    }
    static internal(massage){
        return new ApiError(500, massage)
    }
    static forbidden(massage){
        return new ApiError(403, massage)
    }
    static unauthorized(massage){
        return new ApiError(401, massage)
    }
}

module.exports = ApiError