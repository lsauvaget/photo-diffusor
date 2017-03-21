module.exports =  () => {
    const middlewares = [];

    function add(middleware) {
        middlewares.push(middleware);
    }

    function exec(socket, io) {
        let idx = 0;

        function next(error) {
            if(error) {
                return throw error;
            }
            return middlewares[idx++](socket, io, next);
        }
        next();
    }

    return {add, exec};
}


