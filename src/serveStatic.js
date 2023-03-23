// Code to serve static files

const fs = require('fs');
const path = require('path');

const Router = require('express').Router;

// Scan a directory to produce the directory layout for use as an object
const scanDirectory = (dir) => {
    const files = {};

    const paths = fs.readdirSync(dir);
    paths.forEach((filename) => {
        if (fs.lstatSync(`${dir}/${filename}`).isFile()) {
            const parsed = path.parse(filename);
            files[filename] = parsed.ext;
        } else {
            files[filename] = scanDirectory(`${dir}/${filename}`);
        }
    });

    return files;
};

const serveStatic = () => {
    // Develop index of pages
    const router = Router();

    // Add routes to router
    const addRoute = (route, file, status = 200) => {
        if (route[0] === '/') route = route.slice(1, route.length);
        router.get(`/${route}`, (req, res) => {
            res.status(status);
            res.sendFile(`${process.cwd()}/public/${file}.html`);
        });
    };

    // Add routes from object
    const routesFromObject = (obj, route = '') => {
        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'string') {
                // Add file
                const name = path.parse(key).name;

                addRoute(`${route}${name}`, `${route}${name}`);
            } else {
                routesFromObject(obj[key], `${route}${key}/`);
            }
        });
    };

    // Get routes from static_pug
    const rawRoutes = scanDirectory(`${process.cwd()}/client/static_pug`);

    // Make routes
    routesFromObject(rawRoutes);

    // Get routes from _redirects
    if (
        fs.existsSync(`${process.cwd()}/client/root_files/_redirects`) &&
        fs.lstatSync('client/root_files/_redirects').isFile()
    ) {
        const redirects = fs.readFileSync(
            'client/root_files/_redirects',
            'utf8'
        );
        redirects.split('\n').forEach((line) => {
            const redir = line.split(/[ ]+/);
            if (redir.length < 2) return;
            if (redir.length === 2) addRoute(redir[0], redir[1]);
            if (redir.length === 3) addRoute(redir[0], redir[1], redir[2]);
        });
    }

    // home/index and 404 routes if needed
    if (rawRoutes['home.pug']) addRoute('', 'home');
    if (rawRoutes['index.pug']) addRoute('', 'index');
    if (rawRoutes['404.pug']) addRoute('*', '404', 404);

    return router;
};

module.exports = serveStatic;
