    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    module.exports.run = async (client, interaction, args) => {
        const user = interaction.options.getUser('user') || interaction.user;
        let result = await cs.balance({
            user: user,
            guild: interaction.guild.id
        });
        return interaction.reply(`${user.tag}, has $${(result.wallet).toLocaleString()} in there wallet and $${(result.bank).toLocaleString()} in there bank. There Max bank has been set to $${(result.rawData.bankSpace.toLocaleString())}`);
    }

    module.exports.help = {
        name: "balance",
        data: {
            name: 'balance',
            description: "A way to know the amount of money in your bank.",
            options: [{
                name: 'user',
                type: 'USER',
                description: 'The user you want to check balance of..',
                required: false,
            }]
        }
    }

    module.exports.conf = {
        aliases: ["bal"],
        cooldown: 5
    }