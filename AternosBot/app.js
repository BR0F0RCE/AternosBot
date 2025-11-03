'use strict';
const { createClient } = require('bedrock-protocol');

const ATERNOS_CONFIG = {
    connectTimeout: 30000,
    skipPing: true,
    host: "server212390.aternos.me",
    port: 45910,
    username: "AFKBot",
    version: "1.21.120",
    offline: true
};

const client = createClient(ATERNOS_CONFIG);

client.on('spawn', () => {
    console.log('Bot on.Press Ctrl+C for disconnection.');
});

client.on('text', (packet) => {
    if (packet.type === 'chat') {
        console.log(`[Chat] ${packet.source_name}: ${packet.message}`);
    }
});
process.on('SIGINT', () => {
    client.close();
    process.exit(0);
});