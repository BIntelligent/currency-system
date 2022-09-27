const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
module.exports.run = async (client, interaction, args) => {
  let user = args[2]?.member || interaction.member;
  if (!interaction.member.permissions.has("ADMINISTRATOR"))
    return interaction.reply("You do not have requied permissions.");
  let wheretoPutMoney = args.get("to");
  let amount = args.get("amount");
  let money = parseInt(amount);
  let result = await cs.addMoney({
    user: user,
    guild: interaction.guild,
    amount: money,
    wheretoPutMoney: wheretoPutMoney,
  });
  if (result.error) return interaction.reply("You cant add negitive money");
  else
    interaction.reply(
      `Successfully added $${money} to ${user.user.username}, ( in ${wheretoPutMoney} )`
    );
};

module.exports.help = {
  name: "addmoney",
  data: {
    name: "addmoney",
    description: "A way to add the amount  of money in your bank or wallet.",
    options: [
      {
        name: "amount",
        type: 4,
        description: "Amount of money you want to add.",
        required: true,
      },
      {
        name: "to",
        type: 3,
        description: "Where to add money to?",
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
        description: "The user you want to add money to.",
        required: false,
      },
    ],
  },
};
