export class Result {
    message;
    code;
    data;
    constructor(message, code, data) {
        this.message = message;
        this.code = code;
        this.data = data;
    }
    static success(data) {
        return new Result('RequestSuccess', 200, data);
    }
    static error(message, code) {
        return new Result(message, code, null);
    }
}
export default Result;
