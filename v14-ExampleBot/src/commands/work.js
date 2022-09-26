    const CurrencySystem = require("currency-system");
    const cs = new CurrencySystem;
    module.exports.run = async (client, interaction, args) => {

        let result = await cs.work({
            user: interaction.user,
            guild: interaction.guild,
            maxAmount: 100,
            replies: ['Programmer', 'Builder', 'Waiter', 'Busboy', 'Chief', 'Mechanic'],
            cooldown: 25 //25 seconds,

        });
        if (result.error) return interaction.reply(`You have already worked recently Try again in ${result.time}`);
        else interaction.reply(`You worked as a ${result.workType} and earned $${result.amount}.`)
    }

    module.exports.help = {
        name: "work",
        data: {
            name: 'work',
            description: "A way to earn money",
            options: []
        }
    };

    module.exports.conf = {
        aliases: ["wk", "wr"],
        cooldown: 5 // This number is a seconds, not a milliseconds.
        // 1 = 1 seconds.
    }