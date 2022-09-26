const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, message, args) => {
  // !use <item name from your inventory>
  let item = args[0].value;
  if (!item) return message.reply("What item you wana use?");
  if (parseInt(item))
    return message.reply("Please use the name of the item, not the ID.");
  let haveItem = false;
  const arr = await cs.getUserItems({
    user: message.user,
    guild: message.guild,
  });
  let i;
  for (key in arr.inventory) {
    if (arr.inventory[key].name.toLowerCase().includes(item.toLowerCase()))
      haveItem = true;
    i = key;
  }
  if (haveItem) {
    let money = Math.floor(Math.random() * 10 + 1) * 100; // 100 - 1000
    let result = await cs.addMoney({
      user: message.user,
      guild: message.guild,
      amount: money,
      wheretoPutMoney: "wallet",
    });
    let r2 = await cs.removeUserItem({
      user: message.user,
      guild: message.guild,
      item: i + 1,
      amount: 1,
    });
    if (result.error || r2.error) {
      console.log(result);
      console.log(r2);
      return message.reply("Unknown error occured see console.");
    } else
      return message.reply("You've used " + item + " and earned $" + money);
  } else return message.reply("Please buy the item first!");
};

module.exports.help = {
  name: "use",
  data: {
    name: "use",
    description: "A way to use",
    options: [
      {
        name: "item",
        type: "STRING",
        description: "Item Name of item which you want to use",
        required: true,
      },
    ],
  },
};

module.exports.conf = {
  aliases: [],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
