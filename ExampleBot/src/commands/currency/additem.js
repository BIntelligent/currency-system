const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
exports.run = async (client, message, args) => {
/* let user;
if (message.mentions.users.first()) {
    user = message.mentions.users.first();
} else if (args[0]) {
    user = message.guild.members.cache.get(args[0]).user;
} else {
    user.id = "1"
}

if (user.bot || user === client.user) return message.channel.send("This user is a bot.");
if (!client.users.cache.get(user.id) || !user) return message.channel.send('Sorry, you forgot to mention somebody.');

let amount = args[1];
if (!amount) return message.channel.send("Enter amount of money to add.");
if (amount.includes("-")) return message.channel.send("You can't send negitive money.")
let money = parseInt(amount);

let result = await cs.transferMoney({
    user: message.author,
    user2: user,
    guild: message.guild,
    amount: money
}); */
message.channel.send(result);
}

exports.help = {
name: "additem",
description: "A way to add additem",
usage: "additem @user <item>",
example: "additem <user> <item>"
};

exports.conf = {
aliases: ["ai"],
cooldown: 5 // This number is a seconds, not a milliseconds.
// 1 = 1 seconds.
}