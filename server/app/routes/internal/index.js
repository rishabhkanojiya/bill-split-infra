const path = require("path");
const { readdirSync } = require("fs");

const basePath = ``;
const getDirectories = (source) =>
    readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
const routeDirectories = getDirectories(path.resolve(__dirname, "./"));

module.exports = (app) => {
    routeDirectories.map((dir) => {
        app.use(`/${dir}/${basePath}`, require(`./${dir}`));
    });
};
