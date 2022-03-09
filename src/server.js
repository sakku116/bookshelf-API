const routes = require('./routes')
const Hapi = require('@hapi/hapi');

console.log('Membuat Bookshelf API Untuk Submission Dicoding')

async function init() {
    const server = Hapi.server(
        {
            port: 5000,
            host: 'localhost',
            routes: {
                cors: {
                    origin: ['*'],
                },
            },
        },
    );

    server.route(routes);

    await server.start();
    console.log(`[STARTING] server berjalan pada ${server.info.uri}`);
};

init();