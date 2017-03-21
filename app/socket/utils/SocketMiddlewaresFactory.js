module.exports =  () => {
    const middlewares = [];

    function add(middleware) {
        middlewares.push(middleware);
    }

    function exec(socket, io) {
        let idx = 0;

        function next(error) {
            if(error) {
                throw error;
                return void(0);
            }
            if(middlewares.length && middlewares[idx]) {
                return middlewares[idx++](socket, io, next);
            }
        }
        next();
    }

    return {add, exec};
}


