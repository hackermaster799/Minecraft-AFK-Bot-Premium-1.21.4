      case '$addtime':
        let add = parseInt(command[3]);
        if (command[3].includes('h')) add *= 3600;
        else if (command[3].includes('m')) add *= 60;
        afkTimeRemaining += add;
        bot.chat(`Time added: ${formatTime(add)}`);
        bot.chat(`Time remain: ${formatTime(afkTimeRemaining)}`);
        break;