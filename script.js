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
    debug: true,
    viewDistance: 'far',
    hideErrors: false,
    keepAlive: true
  });

  bot.loadPlugin(pathfinder);

  bot.once('login', () => {
    setTimeout(() => {
      if (!isMuted) bot.chat('/gamemode creative');
    }, 3000); // laukia 3 sek po login
  });

  bot.once('spawn', () => {
    setTimeout(() => {
      if (!isMuted