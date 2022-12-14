// This is an instance of the scokets api interface, its expected to be used externally
window.cs = null

// This is a queue that stores all requests sent before connection is made to the server
let pendingRequests = null;

// This is a global variable that gets updated with true when a
// connection is successfully made to the server and with false when connection drops
let clientConnected = false;

// This is a global function that gets called whenever a new connection
// is established to the server
let onConnected = () => {
};

// This is the total number of tries since connection dropped
let tries = 0;

// This code is responsible for generating the client_id and id for the request.
function generateUuid() {
    const chars = '0123456789abcdef'.split('');
    let uuid = [], rnd = Math.random, r;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4'; // version 4
    for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
            r = 0 | rnd() * 16;
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r & 0xf];
        }
    }
    return uuid.join('');
}

// This class represents the ConnectXone Socket API Interface,
// it exposes functions that allows the web client to talk to the server
class ConversateServer {
    constructor(clientId, cServer, tokenName) {
        this.clientId = clientId;
        this.cServer = cServer;
        this.callbacks = [];
        // set the global onConnected function to a custom function
        // which consumes and sends request in the queue.
        // this functions gets called whenever a connection is successfully made to the server
        onConnected = this.consumeRequestsFromQueue

        this.tokenName = tokenName;
        this.listenForResponses();
    }

    consumeRequestsFromQueue() {
        while (pendingRequests.size() > 0) {
            pendingRequests.dequeue()();
        }
    }

    // listens for new messages from the sockets server
    listenForResponses() {
        this.cServer.onmessage = (message) => {
            const jsonData = JSON.parse(message.data)
            // Loop through callbacks and find callbacks registered with the request id found in this reponse
            // remove callback from list after it has been called
            // This can be optimized if need be, a set data structure can be used.
            this.callbacks.filter((callback) => {
                if (callback.id === jsonData?.id) {
                    // if request was successful, call success callback else call failure callback
                    if (jsonData.client_id === this.clientId &&
                        +jsonData?.code >= 200 && +jsonData?.code < 300) {
                        callback.onSuccess(jsonData)
                    } else {
                        callback.onFailure(jsonData)
                    }
                    return false;
                }
                return true;
            })
        }
    }

    // This is the implementation that sends the request
    submitRequest(action, onSuccess, onFailure, data = null) {
        // generate a unique request id
        const id = generateUuid();
        // lookup token using provided localstorage key
        const token = localStorage.getItem(this.tokenName)
        // request must contain the following:
        // 1) An Id to uniquely identify the request
        // 2) A client id to uniquely identify the user agent sending the request
        // 3) An action, the name of the action to perform on the server
        // 4) An optional request data/payload
        // 5) An optional token if the request needs to be authenticated
        const payload = {
            id,
            client_id: this.clientId,
            action,
            parameter: data,
            token
        }
        // Sends request through the existing websocket connection
        this.cServer.send(JSON.stringify(payload))

        // push success and failure callbacks with request id to callbacks array.
        // The request id helps identify which sets of callbacks(success & failure)
        // to call with a specific response data, every response contains the request id
        this.callbacks.push({id, onSuccess, onFailure})
    }

    // sends a request to the socket api using submitRequest
    converse(action, onSuccess, onFailure, data = null) {
        // If client is connected to server, send request
        if (clientConnected) {
            this.submitRequest(action, onSuccess, onFailure, data)
        } else {
            // add request to queue if client is not connected
            pendingRequests.enqueue(() => {
                this.submitRequest(action, onSuccess, onFailure, data)
            })
        }
    }
}

// This class is basically responsible for initializing the Socket API Interface
export class ConversateInitializer {
    connect(url, totalTries = null, tokenName = "token") {
        pendingRequests = new RequestQueue();
        // generate new client id to establish a new connection to the server
        const clientId = generateUuid();
        tries++;
        const cServer = new WebSocket(`${url}/${clientId}`)
        cServer.onopen = (evt) => {
            clientConnected = true;
            onConnected();
        }
        cServer.onclose = (evt) => {
            clientConnected = false;
            console.error(`Connection Closed...Retrying (${tries})`)
            // check if user has set max retries, if so, only try that much times
            if (totalTries === null) {
                // only try connecting if client is not connected.
                if (!clientConnected) {
                    this.connect(url, totalTries, tokenName)
                }
            } else {
                if (tries <= totalTries && !clientConnected) {
                    this.connect(url, totalTries, tokenName)
                }
            }
        }
        cServer.onerror = (evt) => {
            clientConnected = false;
        }
        // create an instance of the Socket Server
        window.cs = new ConversateServer(clientId, cServer, tokenName)

    }
}

// This is an implementation of a Queue,
// found on https://stackoverflow.com/questions/45704512/javascript-queue-native and modified
class RequestQueue {
    constructor() {
        this.oldestIndex = 1;
        this.newestIndex = 1;
        this.storage = {};
    }

    size() {
        return this.newestIndex - this.oldestIndex;
    };

    enqueue(data) {
        this.storage[this.newestIndex] = data;
        this.newestIndex++;
    };

    dequeue() {
        var oldestIndex = this.oldestIndex,
            newestIndex = this.newestIndex,
            deletedData;

        if (oldestIndex !== newestIndex) {
            deletedData = this.storage[oldestIndex];
            delete this.storage[oldestIndex];
            this.oldestIndex++;

            return deletedData;
        }
    };
}
