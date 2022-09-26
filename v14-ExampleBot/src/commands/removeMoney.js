const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  let user = args[2]?.member || interaction.member;
  if (!interaction.member.permissions.has("ADMINISTRATOR"))
    return interaction.reply("You do not have requied permissions.");
  let wheretoPutMoney = args.get("from");
  let amount = args.get("amount");
  let result = await cs.removeMoney({
    user: user,
    guild: interaction.guild,
    amount: amount,
    wheretoPutMoney: wheretoPutMoney,
  });
  if (result.error) return interaction.reply("You cant remove negitive money");
  else
    interaction.reply(
      `Successfully removed $${
        amount === "all" ? "all money" : `${amount}`
      } from ${user.user.username}, ( from ${wheretoPutMoney} )`
    );
};

module.exports.help = {
  name: "removemoney",
  data: {
    name: "removemoney",
    description: "A way to remove the amount  of money from bank or wallet.",
    options: [
      {
        name: "amount",
        type: 3,
        description: "Amount of money you want to remove.",
        required: true,
      },
      {
        name: "from",
        type: 3,
        description: "Where to remove money from?",
        required: true,
        choices: [
          {
            name: "wallet",
            value: "wallet",
          },
          {
            name: "bank",
            value: "bank",
          },
        ],
      },
      {
        name: "user",
        type: 6,
        description: "The user you want to remove money to.",
        required: false,
      },
    ],
  },
};
