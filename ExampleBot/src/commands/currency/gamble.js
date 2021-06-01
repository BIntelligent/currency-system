    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
exports.run = async (client, message, args) => {

    let money = args.join(" ");
    if (isNaN(money)) return message.channel.send("Amount is not a number.");

    let result = await cs.gamble({
        user: message.author,
        guild: message.guild,
        amount: money,
        minAmount: 1,
        cooldown: 25 //25 seconds
    });
    message.channel.send(result);
} 

exports.help = {
    name: "gamble",
    description: "An efficient way to double your money.",
    usage: "gamble <bet/amount>",
    example: "gamble 500"
}

exports.conf = {
    aliases: ["gambling"],
    cooldown: 5
}