/*jshint esversion: 9 */
/**
 * Command: stats
 * shows some stuff
 */


var Command = require('@models/Command'),
  CommentBuilder = require('@models/CommentBuilder'),
  Common = require('@helpers/common');

class Stats extends Command {

  // core COMMAND getters
  get group () {
    return 'info';
  }

  get hidden () {
    return true;
  }

  //make sure all properties are set
  static initStats ({server}) {
    if(!server.stats) server.stats = {};
    if(!server.stats.characterCount) server.stats.characterCount = 0;
    if(!server.stats.wordCount) server.stats.wordCount = 0;
    if(!server.stats.uniqueUsers) server.stats.uniqueUsers = {

    };
  }

  //take a message and extract parts to add to stats
  static addMessageStats({server, message}) {
    Stats.initStats({server});
    server.stats.characterCount += message.cleanContent.replace(/\s/g, '').length;
    server.stats.wordCount += message.cleanContent.split(/\s/).length;
    server.stats.uniqueUsers[message.member.id] = true;
  }

  static getServerStats({server}){
    Stats.initStats({server});
    var uniqueUsers = Object.keys(server.stats.uniqueUsers).length;
    return {
      uniqueUsers : uniqueUsers,
      characterCount : server.stats.characterCount,
      wordCount : server.stats.wordCount
    }
  }

  static getWorldStats({world, sort, limit}) {
    var stats = [];
    for (var id in world.servers) {
      var server = world.servers[id];
      stats.push({
        _heading : server.server_name,
        _data : Stats.getServerStats({server})
      });
    }

    if(sort) stats = stats.sort(sort);
    if(limit) stats = stats.slice(0, limit);

    return stats;
  }

  execute ({input}) {
    var world = input.world;
    if (!input.ownerCanManageTheServer()) return input.il8nResponse('general.nope');

    Stats.initStats({server});
    var stats = Stats.getWorldStats({world, sort : (a,b) => b._data.characterCount - a._data.characterCount, limit: 5});

    var help = new CommentBuilder({
      data : { stats  :  stats },
      formatKey : true
    });

    input.response(help.out());
  }

  onMessage({message, server}) {
    Stats.addMessageStats({server, message});
    return null;
  }
}

//registration
exports.register = (commands) => {
  commands.add(Stats.command)
};

exports.unRegister = (commands) => {
  commands.remove(Stats.command)
};

exports.Stats = Stats;
