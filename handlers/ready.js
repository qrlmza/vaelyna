const readyHandler = (client) => {
    client.once('ready', async () => {
        console.log(`📡 → Connecté en tant que ${client.user.username}`);
    });
}

module.exports = readyHandler;