const CurrencySystem = require("currency-system");
const Discord = require("discord.js");
const cs = new CurrencySystem;

module.exports.run = async (client, interaction, args) => {
    let data = await cs.globalLeaderboard();
    if (data.length < 1) return interaction.reply("Nobody's in Global leaderboard yet.");
    const msg = new Discord.interactionEmbed();
    let pos = 0;
    // This is to get First 10 Users )
    data.slice(0, 10).map(e => {
        if (!client.users.cache.get(e.userID)) return;
        pos++
        msg.addField(`${pos} - **${client.users.cache.get(e.userID).username}**`, `Wallet: **${e.wallet}** - Bank: **${e.bank}**`, true);
    });

    interaction.reply({
        embeds: [msg]
    }).catch();

}

module.exports.help = {
    name: "globallb",
    data: {
        name: 'globallb',
        description: "show's Global leaderboard.",
        options: []
    }
}

module.exports.conf = {
    aliases: ["glb"],
    cooldown: 5
}