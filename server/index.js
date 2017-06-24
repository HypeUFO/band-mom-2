const path = require('path');
const express = require('express');

const app = express();

const admin = require("firebase-admin");

const serviceAccount = require("https://www.dropbox.com/s/ku0wfg90fz1ffbf/band-mom-firebase-adminsdk-f4hbv-4d244ec55d.json?dl=0");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://band-mom.firebaseio.com"
});



// API endpoints go here!


// Serve the built client
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Unhandled requests which aren't for the API should serve index.html so
// client-side routing using browserHistory can function
app.get(/^(?!\/api(\/|$))/, (req, res) => {
    const index = path.resolve(__dirname, '../client/build', 'index.html');
    res.sendFile(index);
});

let server;
function runServer(port=3001) {
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            resolve();
        }).on('error', reject);
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

if (require.main === module) {
    runServer();
}

module.exports = {
    app, runServer, closeServer
};
