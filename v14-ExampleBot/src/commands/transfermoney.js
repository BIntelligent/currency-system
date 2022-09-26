    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    module.exports.run = async (client, interaction, args) => {
        let user = interaction.options.getUser('user');
        if (user.id === interaction.user.id) return interaction.channel.send(`You can't transfer money to yourself!`);

        let amount = interaction.options.getInteger('amount');

        if (!amount) return interaction.reply("Enter amount of money to add.");
        if (String(amount).includes("-")) return interaction.reply("You can't send negitive money.")
        let money = parseInt(amount);

        let result = await cs.transferMoney({
            user: interaction.user,
            user2: user,
            guild: interaction.guild,
            amount: money
        });
        if (result.error) return interaction.reply(`You don't have enough money in your wallet.`);
        else interaction.reply(`**${interaction.user.username}**, Successfully transfered **${result.money}** to **${result.user2.username}**`)

    }

    module.exports.help = {
        name: "transfer",
        data: {
            name: 'transfer',
            description: "A way to transfer money",
            options: [{
                    name: 'amount',
                    type: 4,
                    description: 'amount to transfer',
                    required: true,
                },
                {
                    name: 'user',
                    type: 6,
                    description: 'user to trasnfer money to',
                    required: true,
                }
            ]
        }

    };

    module.exports.conf = {
        aliases: ["pay"],
        cooldown: 5 // This number is a seconds, not a milliseconds.
        // 1 = 1 seconds.
    }