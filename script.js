const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');

let afkInterval;
let afkTimeRemaining = 0;
let isPaused = false;
let isMuted = false;

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

createBot();

function createBot() {
  const bot = mineflayer.createBot({
    host: 'IprastasServeris.aternos.me',
    port: 47602,
    username: '24/7LumberChick',
    auth: 'offline',
    version: '1.21.4',
    debug: false,
    viewDistance: 'far',
    hideErrors: false,
    keepAlive: true
  });

  bot.loadPlugin(pathfinder);

  bot.once('login', () => {
    setTimeout(() => {
      if (!isMuted) bot.chat('/gamemode creative');
    }, 3000);
  });

  bot.once('spawn', () => {
    setTimeout(() => {
      if (!isMuted) bot.chat('/gamemode creative');
      if (!isMuted) bot.chat('/tp @s 0 64 0');
    }, 4000);
  });

  bot.on('end', (reason) => {
    console.log('🔄 Disconnected. Reason:', reason);
    setTimeout(createBot, 5000);
  });

  bot.on('kicked', (reason) => {
    console.log('⛔ Kicked:', reason);
  });

  bot.on('error', (err) => {
    console.log(`❌ Error: ${err}`);
  });

  bot.on('messagestr', (message) => {
    if (message.includes(bot.username)) return;
    const command = message.split(' ');
    const username = command[1]?.replace(':', '');

    switch (command[2]) {
      case '$bot':
        let time = parseInt(command[3]);
        if (command[3].includes('h')) time *= 3600;
        else if (command[3].includes('m')) time *= 60;
        afkTimeRemaining = time;
        if (!isMuted) bot.chat(`Time: ${formatTime(time)}`);
        afkInterval = setInterval(() => {
          if (!isPaused) {
            afkTimeRemaining--;
            if (afkTimeRemaining <= 0) {
              clearInterval(afkInterval);
              if (!isMuted) bot.chat('AFK time ended.');
            }
          }
        }, 1000);
        break;

      case '$stop':
        isPaused = true;
        if (!isMuted) bot.chat('Timer stopped.');
        break;

      case '$resume':
        if (afkTimeRemaining > 0 && isPaused) {
          isPaused = false;
          if (!isMuted) bot.chat(`Back AFK for: ${formatTime(afkTimeRemaining)}`);
        } else {
          if (!isMuted) bot.chat('No timer has been set.');
        }
        break;

      case '$checktime':
        if (!isMuted) bot.chat(`Time remain: ${formatTime(afkTimeRemaining)}`);
        break;

      case '$break':
        clearInterval(afkInterval);
        afkTimeRemaining = 0;
        if (!isMuted) bot.chat('AFK ended manually.');
        break;

      case '$addtime':
        let add = parseInt(command[3]);
        if (command[3].includes('h')) add *= 3600;
        else if (command[3].includes('m')) add *= 60;
        afkTimeRemaining += add;
        if (!isMuted) bot.chat(`Time added: ${formatTime(add)}`);
        if (!isMuted) bot.chat(`Time remain: ${formatTime(afkTimeRemaining)}`);
        break;

      case '$mute':
        isMuted = true;
        bot.chat('Bot muted.');
        break;

      case '$unmute':
        isMuted = false;
        bot.chat('Bot unmuted.');
        break;
    }
  });
}