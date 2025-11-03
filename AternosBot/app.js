'use strict';
const { createClient } = require('bedrock-protocol');
const http = require('http');

console.log('🚀 Starting Minecraft Bedrock Bot on Koyeb...');

const ATERNOS_CONFIG = {
    connectTimeout: 30000,
    skipPing: true,
    host: process.env.SERVER_HOST || "server212390.aternos.me",
    port: parseInt(process.env.SERVER_PORT) || 45910,
    username: process.env.BOT_NAME || "AFKBot",
    version: process.env.MC_VERSION || "1.21.120",
    offline: true
};

// Health check сервер для Koyeb
const server = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            service: 'minecraft-bedrock-bot',
            connected: client && client.connected,
            timestamp: new Date().toISOString()
        }));
    } else {
        res.writeHead(200);
        res.end('Minecraft Bedrock Bot is running on Koyeb!');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`❤️ Health server running on port ${PORT}`);
});

let client;

function connectToServer() {
    try {
        console.log(`🔗 Connecting to ${ATERNOS_CONFIG.host}:${ATERNOS_CONFIG.port}...`);
        
        client = createClient(ATERNOS_CONFIG);

        client.on('spawn', () => {
            console.log('✅ Bot connected to server! Press Ctrl+C to disconnect.');
        });

        client.on('text', (packet) => {
            if (packet.type === 'chat') {
                console.log(`💬 [Chat] ${packet.source_name}: ${packet.message}`);
            }
        });

        client.on('disconnect', (packet) => {
            console.log('🔌 Disconnected from server:', packet?.message || 'No reason');
            console.log('🔄 Reconnecting in 10 seconds...');
            setTimeout(connectToServer, 10000);
        });

        client.on('error', (error) => {
            console.log('❌ Connection error:', error.message);
            console.log('🔄 Reconnecting in 15 seconds...');
            setTimeout(connectToServer, 15000);
        });

    } catch (error) {
        console.log('💥 Failed to create client:', error.message);
        console.log('🔄 Retrying in 20 seconds...');
        setTimeout(connectToServer, 20000);
    }
}

// Обработка graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    if (client) {
        client.close();
    }
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    if (client) {
        client.close();
    }
    process.exit(0);
});

// Запуск бота
connectToServer();
