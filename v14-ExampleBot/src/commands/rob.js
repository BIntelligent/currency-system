    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    module.exports.run = async (client, interaction, args) => {
        let user = args[0].user
        if (user.bot || user === client.user) return interaction.reply("This user is a bot.");
        if (!user) return interaction.reply('Sorry, you forgot to mention somebody.');

        let result = await cs.rob({
            user: interaction.user,
            user2: user,
            guild: interaction.guild,
            minAmount: 100,
            successPercentage: 5,
            cooldown: 25, //25 seconds,
            maxRob: 1000
        });
        if (result.error) {
            if (result.type === 'time') return interaction.reply(`You have already robbed recently Try again in ${result.time}`);
            if (result.type === 'low-money') return interaction.reply(`You need atleast $${result.minAmount} to rob somebody.`);
            if (result.type === 'low-wallet') return interaction.reply(`${result.user2.username} have less than $${result.minAmount} to rob.`)
            if (result.type === 'caught') return interaction.reply(`${interaction.user.username} you robbed ${result.user2.username} and got caught and you payed ${result.amount} to ${result.user2.username}!`)
        } else {
            if (result.type === 'success') return interaction.reply(`${interaction.user.username} you robbed ${result.user2.username} and got away with ${result.amount}!`)

        }

    }

    module.exports.help = {
        name: "rob",
        data: {
            name: 'rob',
            description: "A way to earn money",
            options: [{
                name: 'user',
                type: 6,
                description: 'The user you want to rob..',
                required: true,
            }]
        }
    };

    module.exports.conf = {
        aliases: [],
        cooldown: 5 // This number is a seconds, not a milliseconds.
        // 1 = 1 seconds.
    }