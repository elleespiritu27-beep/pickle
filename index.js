const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. Web server to keep Render alive
app.get('/', (req, res) => {
  res.send('Minecraft Server Keeper Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Web server listening on port ${PORT}`);
});

// 2. Mineflayer Bot Configuration
const botOptions = {
  host: 'crackedpvpp.play.hosting',       // Put your Minecraft IP here
  port: 60995,                  // Put your Minecraft Port here (Default is 25565)
  username: 'ServerKeeperBott',  
  version: false                // Auto-detects Minecraft version
};

function createBot() {
  const bot = mineflayer.createBot(botOptions);

  bot.on('spawn', () => {
    console.log('Bot successfully joined the Minecraft server.');
  });

  bot.on('end', (reason) => {
    console.log(`Bot disconnected: ${reason}. Reconnecting in 10 seconds...`);
    setTimeout(createBot, 10000); 
  });

  bot.on('error', (err) => {
    console.log(`Error encountered: ${err.message}`);
  });
}

createBot();
