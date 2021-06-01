    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
    let user;
    if (message.mentions.users.first()) {
        user = message.mentions.users.first();
    } else if (args[0]) {
        user = message.guild.members.cache.get(args[0]).user;
    }

    if (user.bot || user === client.user) return message.channel.send("This user is a bot.");
    if (!user) return message.channel.send('Sorry, you forgot to mention somebody.');
    
    let result = await cs.rob({
        user: message.author,
        user2: user,
        guild: message.guild,
        minAmount: 100,
        successPercentage: 5,
        cooldown: 25 //25 seconds
    });

    message.channel.send(result);
}

exports.help = {
    name: "rob",
    description: "A way to earn money",
    example: "rob",
    usage: "rob"
};

exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}