const {
    cmdHandler,
    logger
} = require("@silent-coder/discord-cmd-handler");
const Discord = require("discord.js")
const client = new Discord.Client();

const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
client.login("LOGIN");
//sets mongo url
cs.setMongoURL("MONGO URL");
//sets default wallet amount when ever new user is created.
cs.setDefaultWalletAmount(100)
//sets default bank amount when ever new user is created.
cs.setDefaultBankAmount(1000)


client.on("ready", () => {
    //I'm using logger and not console beacuse it has colours :) 
    logger.info(`Logged in as ${client.user.tag} Successfully..!!`)
    cmdHandler(client, {
        logs: {
            consoleLogEnabled: true,
            consoleLogMessage: "{user.tag} ( {user.id} ) ran a command: {command} in {guild.name} ( {channel.name} )",
            cmdLogEnabled: false,
            cmdLogChannel: "ChannelID HERE",
            cmdLogMessage: "{user.tag} ( {user.id} ) ran a command: {command} in {guild.name} ( {channel.name} )"
        },
        cooldownMSG: "Calm down, {user.tag}, You still have {time} before you can run the command again.",
        EnableCommmandonEdit: true,
        mentionPrefix: true,
        prefix: "?",
        owners: ["YOUR DISCORD ID", "YOUR TRUSTED FRIEND Discord ID"],
        path: __dirname + "/commands",
        logCommands: true
    });
    //This will load all commands.
});
process.on("unhandledRejection", _=> logger.error(_.stack+'\n' + '='.repeat(20)))
