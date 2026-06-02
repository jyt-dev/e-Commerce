// asyncHandler wraps async controllers and forwards errors to Express error middleware.
// It eliminates the need to write try-catch in every controller.

// It takes an async function as an argument and returns a new middleware function.
// Promise.resolve() handles successful execution, while .catch() passes any error to next().

const asyncHandler = (fun) => {
    return (req, res, next) => {
        Promise
            .resolve(fun(req, res, next))
            .catch((err) => next(err));
    }
}
export { asyncHandler }

// Promise.resolve() executes the async function and converts its result into a Promise.
// If the Promise is rejected (or the function throws an error),
// .catch(next) forwards the error to Express's error-handling middleware