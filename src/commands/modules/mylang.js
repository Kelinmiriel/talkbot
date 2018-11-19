
var langMap = require("@helpers/langmap");

// models
var BotCommand = require('@models/BotCommand');

/**
 * Command: mylang
 * sets language user config
 *
 * usage !mylang au
 *
 * US
 * NL
 * AU
 * GB
 * FR
 * CA
 * DE
 * IT
 * JP
 * KR
 * BR
 * ES
 * SE
 * TR
 *
 * @param   {[MessageDetails]}  msg     [message releated helper functions]
 * @param   {[Server]}  server  [Object related to the Server the command was typed in.]
 * @param   {[World]}  world   [Object related to the realm and general bot stuff]
 *
 * @return  {[undefined]}
 */
function mylang(msg, server, world) {
  if (server.isPermitted(msg.user_id)) {
    var doc = langMap.get(msg.getMessage());

    if (doc && doc.code) {
      server.permitted[msg.user_id].language = doc.code;
    }

    msg.response(server.lang('mylang.okay', { lang: doc.code }));
  } else {
    msg.response(server.lang('mylang.deny'));
  }
};

var command = new BotCommand({
  command_name: 'mylang',
  execute: mylang,
  short_help: 'mylang.shorthelp',
  long_help: 'mylang.longhelp',
});


exports.register = function (commands) {
  commands.add(command);
};

exports.unRegister = function (commands) {
  commands.remove(command);
};