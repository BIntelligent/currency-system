    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    let money = args.join(" ");
    if (!money) return message.channel.send("Enter the amount you want to withdraw.");

    let result = await cs.withdraw({
        user: message.author,
        guild: message.guild,
        amount: money
    });
    message.channel.send(result);
}

exports.help = {
    name: "withdraw",
    description: "A way to get money out of the bank.",
    usage: "withdraw <amount>",
    example: "withdraw 500"
}

exports.conf = {
    aliases: ["wd"],
    cooldown: 5
}