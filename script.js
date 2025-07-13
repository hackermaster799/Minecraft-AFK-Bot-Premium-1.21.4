const mineflayer = require('mineflayer');
const { pathfinder } = require('mineflayer-pathfinder');

let afkInterval;
let afkTimeRemaining = 0;
let isPaused = false;

createBot();

function createBot() {
  const bot = mineflayer.createBot({
    host: 'IprastasServeris.aternos.me',
    port: 47602,
    username: '24/7LumberChick',
    auth: 'offline',
    version: '1.21.4',
    debug: true,
    viewDistance: 'far',
    hideErrors: false
  });

  bot.loadPlugin(pathfinder);

  bot.once('login', () => console.log('✅ Bot has logged in.'));
  bot.once('end', () => {
    console.log('🔄 Bot disconnected. Reconnecting...');
    setTimeout(createBot, 5000);
  });

  bot.on('spawn', () => console.log('🚀 Bot joined the server.'));
  bot.on('error', (err) => console.log(`❌ Error: ${err}`));

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
        bot.chat(`Time: ${formatTime(time)}`);
        bot.chat('/gamemode survival');
        afkInterval = setInterval(() => {
          if (!isPaused) {
            afkTimeRemaining--;
            if (afkTimeRemaining <= 0) {
              clearInterval(afkInterval);
              bot.chat('/gamemode spectator');
            }
          }
        }, 1000);
        break;

      case '$stop':
        isPaused = true;
        bot.chat('Timer stopped.');
        break;

      case '$resume':
        if (afkTimeRemaining > 0 && isPaused) {
          isPaused = false;
          bot.chat(`Back AFK for: ${formatTime(afkTimeRemaining)}`);
          bot.chat('/gamemode survival');
        } else {
          bot.chat('No timer has been set.');
        }
        break;

      case '$checktime':
        bot.chat(`Time remain: ${formatTime(afkTimeRemaining)}`);
        break;

      case '$break':
        clearInterval(afkInterval);
        afkTimeRemaining = 0;
        bot.chat('/gamemode spectator');
        bot.chat('Timer stopped.');
        break;

      case '$addtime':
        let add = parseInt(command[3]);
        if (command[3].includes('h')) add *= 3600;
        else if (command[3].includes('m')) add *= 60;
        afkTimeRemaining += add;
        bot.chat(`Time added: ${formatTime(add)}`);
        bot.chat(`Time remain: ${formatTime(af
