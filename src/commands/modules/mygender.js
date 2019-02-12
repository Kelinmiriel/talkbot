// models
var BotCommand = require('@models/BotCommand');


/**
 * Command: mygender
 * sets your gender user config
 *
 * usage !mygender male
 *
 * @param   {[MessageDetails]}  msg     [message releated helper functions]
 * @param   {[Server]}  server  [Object related to the Server the command was typed in.]
 * @param   {[World]}  world   [Object related to the realm and general bot stuff]
 *
 * @return  {[undefined]}
 */

function mygender(msg, server, world) {
  if (msg.args.length == 0) return;

  if(msg.args[0] == 'default'){
    server.addUserSetting(msg.user_id, 'gender', 'default');
    msg.response( server.lang('general.auto', {key: "mygender"}) );
    return;
  }

  if (server.isPermitted(msg.user_id)) {
    var gender = msg.getMessage().trim();
    if (/^(boy|bud|chap|bloke|man|dude|m|male)$/i.test(gender)) {
      gender = "MALE";
    } else if (/^(girl|feminine|lady|gal|women|chick|f|female)$/i.test(gender)) {
      gender = "FEMALE";
    } else {
      gender = "FEMALE";
    }

    server.permitted[msg.user_id].gender = gender;
    server.addUserSetting(msg.user_id,'gender',gender);


    var response = server.lang('mygender.okay', { gender: gender });

    var voiceName = server.getUserSetting(msg.user_id,'name');
    if( voiceName && voiceName != "default" ) {
      response += "\n" + server.lang('myvoice.noped');
    }

    server.addUserSetting(msg.user_id, 'name', 'default');
    msg.response(response);

  } else {
    msg.response(server.lang('mygender.deny'));
  }
};

var command = new BotCommand({
  command_name: 'mygender',
  command_arg: 'g',
  execute: mygender,
  short_help: 'mygender.shorthelp',
  long_help: 'mygender.longhelp',
});

exports.register = function (commands) {
  commands.add(command);
};

exports.unRegister = function (commands) {
  commands.remove(command);
};
