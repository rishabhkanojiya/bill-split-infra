const servers = {};
module.exports = (serverType) => {
    if (!servers[serverType]) {
        let supertest = require("supertest");
        let app = require("../../app/server");
        app = app.listen(0);
        let request = supertest(app);
        request.app = app;
        servers[serverType] = request;
    }
    return servers[serverType];
};
