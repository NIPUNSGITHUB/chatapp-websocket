const http = require('http');
const webSocketServer = require('websocket');
clients = {};  
const _PORT = 8000;

//Create node server to create the handshake 
const httpServer = http.createServer((req, res) => {
    console.log("dasd");
})
const ws = new webSocketServer.server({
    "httpServer": httpServer
});

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

ws.on('request', function (request) { 
    console.log('Request Origin ' + request.origin);
    console.log((new Date()) + ' Connection accepted.');
    var userID = getUniqueID(); 
    const connection = request.accept(null, request.origin); 
    //Available connections
    clients[userID] = connection;
    connection.on('message', function (message) {
       
        console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

        if (message.type === 'utf8') { 
            for (key in clients) {
                clients[key].sendUTF(message.utf8Data);
            } 
        }
        else if (message.type === 'binary') {
            for (key in clients) {
                clients[key].sendBytes(message.binaryData);
            } 
        }
    }) 

    connection.on('close',function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        
    })
})



httpServer.listen(_PORT, () => console.log("Server is created. PORT is " + _PORT))

