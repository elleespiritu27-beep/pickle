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
  
  // Start the Minecraft connection ONLY after the web host is completely open
  startMinecraftBot();
});

// ----------------------------------------------------
// 2. CONFIGURATION VARIABLES (UPDATED FOR NEW PORT)
// ----------------------------------------------------
const botOptions = {
  host: 'crackedpvpp.play.hosting', // Your new server address
  port: 60995,                      // Your exact custom port
  username: 'ServerKeeperBot',      // The username your bot will use
  version: '1.21.1'                 // Forces the 1.21.x protocol matching version 1.21.11
};

// ----------------------------------------------------
// 3. CORE BOT LOGIC
// ----------------------------------------------------
function startMinecraftBot() {
  console.log('[MINECRAFT] Initializing connection sequence for 1.21.11...');
  const bot = mineflayer.createBot(botOptions);
  let afkInterval;

  bot.on('spawn', () => {
    console.log(`[SUCCESS] ${bot.username} has spawned in the server.`);

    // Anti-AFK jumping loop every 45 seconds so it never idles out
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
    console.log(`[DISCONNECTED] Reason: ${reason}. Reconnecting in 15 seconds...`);
    clearInterval(afkInterval);
    setTimeout(startMinecraftBot, 15000); 
  });

  bot.on('error', (err) => {
    console.log(`[ERROR] ${err.message}`);
  });
}
