const CurrencySystem = require("currency-system");
const {
    MessageEmbed
} = require("discord.js");
const cs = new CurrencySystem;

exports.run = async (client, message, args) => {
    
    let data = await cs.leaderboard(message.guild.id);
    // This is to get First 10 Users
    data = data.slice(0, 10);
    if (data.length < 1) return message.channel.send("Nobody's in leaderboard yet.");
    const msg = new MessageEmbed()
        .addField(`**Leaderboard**:`, data.map(key => `${(data.findIndex(i => i.guildID === key.guildID && i.userID === key.userID) + 1)}. **${client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).username : "Unknown"}#${client.users.cache.get(key.userID) ? client.users.cache.get(key.userID).discriminator : "0000"}** - **${key.wallet}** - **${key.bank}**`).join("\n"));
    message.channel.send(msg).catch();
}

exports.help = {
    name: "leaderboard",
    description: "show's guild leaderboard.",
    usage: "leaderboard",
    example: "leaderboard"
}

exports.conf = {
    aliases: ["lb"],
    cooldown: 5
}