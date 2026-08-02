// ----------------------------------------------------
// DEPENDENCIES
// ----------------------------------------------------
const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// ----------------------------------------------------
// 1. KEEP-ALIVE WEB SERVER (For Render hosting)
// ----------------------------------------------------
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[RENDER] Web server successfully bound to port ${PORT}`);
  startMinecraftBot();
});

// ----------------------------------------------------
// 2. CONFIGURATION VARIABLES (CALIBRATED FOR 1.21.11)
// ----------------------------------------------------
const botOptions = {
  host: '62.141.62.8',         // Fixed numeric server IP
  port: 60995,                 // Exact custom connection port
  username: 'ServerKeeperBot', // Bot network name
  version: '1.21.1',           // FORCED INTERFACE: Mineflayer protocol match for 1.21.11
  checkTimeoutInterval: 90000  // Prevents proxy packet timeouts up to 90 seconds
};

// ----------------------------------------------------
// 3. CORE BOT LOGIC
// ----------------------------------------------------
function startMinecraftBot() {
  console.log('[MINECRAFT] Handshaking into server with forced 1.21.11 matching protocol...');
  const bot = mineflayer.createBot(botOptions);
  let afkInterval;

  bot.on('spawn', () => {
    console.log(`[SUCCESS] ${bot.username} has spawned in the server.`);

    clearInterval(afkInterval);
    afkInterval = setInterval(() => {
      if (bot && bot.entity) {
        bot.setControlState('jump', true);
        setTimeout(() => {
          bot.setControlState('jump', false);
        }, 500);
        console.log('[ANTI-AFK] Bot executed jump.');
      }
    }, 45000);
  });

  bot.on('end', (reason) => {
    console.log(`[DISCONNECTED] Reason: ${reason}. Retrying connection loop in 20 seconds...`);
    clearInterval(afkInterval);
    setTimeout(startMinecraftBot, 20000); 
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] Connection failed: ${err.message}`);
  });
}
