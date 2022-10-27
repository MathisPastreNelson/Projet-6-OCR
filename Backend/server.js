// Modules qui permet à nodeJS de se comporté comme un serveur
const http = require('http');
const app = require('./app')

// Renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Récupère les différentes erreurs et les gère de manière appropriée
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' demande des privilèges plus élevés.');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' est déja utilisé.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Démarrage du serveur avec la méthode createServer
const server = http.createServer(app);

// Ecouteur d'évènement consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Serveur démarré sur ' + bind);
});

// Le serveur est configuré pour écouter le port 3000 par defaut
server.listen(port);