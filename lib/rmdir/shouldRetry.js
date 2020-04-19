/** 
 * If an EBUSY, EMFILE, ENFILE, ENOTEMPTY, or EPERM error is encountered
 * Node.js will retry the operation with a linear backoff wait of retryDelay ms longer on each try
*/
module.exports = function shouldRetry(err) {
    if (!err) {
        return false;
    }

    const map = {
        EBUSY: "",
        EMFILE: "",
        ENFILE: "",
        ENOTEMPTY: "",
        EPERM: ""
    }

    return err.code in map;
}