const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
const Discord = require("discord.js");

module.exports.run = async (client, interaction, args) => {
    // Slots code Start here:
    const ifLostmoney = 5000;
    const user = await cs.findUser({
        user: interaction.author,
        guild: interaction.guild
    });

    if (user.wallet < ifLostmoney) return interaction.channel.send(`You don't have enough money to play this game. You need $${Math.abs(user.wallet - ifLostmoney)} more to play.`);
    /* SPIN ANIMATION*/
    const slotemoji = ":money_mouth:"; // You can even use animated emojis!
    /* ITEMS (SLOTS) */
    let items = ['💵', '💍', '💯'];
    /* RANDOM */
    let $ = items[Math.floor(items.length * Math.random())];
    let $$ = items[Math.floor(items.length * Math.random())];
    let $$$ = items[Math.floor(items.length * Math.random())];
    /* EMBEDS */

    const play = new Discord.interactionEmbed()
        .setTitle("Slot Machine")
        .setDescription("• " + slotemoji + "  " + slotemoji + "  " + slotemoji + " •")
        .setColor('RANDOM')
        .setFooter("Are you lucky?")

    const $1 = new Discord.interactionEmbed()
        .setTitle("Slot Machine")
        .setDescription("• " + $ + "  " + slotemoji + "  " + slotemoji + " •")
        .setColor('RANDOM')
        .setFooter("Are you lucky?")

    const $2 = new Discord.interactionEmbed()
        .setTitle("Slot Machine")
        .setDescription("• " + $ + "  " + $$ + "  " + slotemoji + " •")
        .setColor('RANDOM')
        .setFooter("Are you lucky?")


    const $3 = new Discord.interactionEmbed()
        .setTitle("Slot Machine")
        .setDescription("• " + $ + "  " + $$ + "  " + $$$ + " •")
        .setColor('RANDOM')
        .setFooter("Are you lucky?")

    /* SPIN THE SLOTS */
    await interaction.deferReply();
    interaction.followUp({
        embeds: [play]
    });
    setTimeout(() => {
        interaction.editReply({
            embeds: [$1]
        });
    }, 600);
    setTimeout(() => {
        interaction.editReply({
            embeds: [$2]
        });
    }, 1200);
    setTimeout(() => {
        interaction.editReply({
            embeds: [$3]
        });
    }, 1800);

    /* DEDUCT RESULTS */
    if ($$ !== $ && $$ !== $$$) {
        setTimeout(async () => {
            let result = await cs.removeMoney({
                user: interaction.user,
                guild: interaction.guild, // { id: null }
                amount: ifLostmoney,
            });
            interaction.followUp(`Shit, ${interaction.user.tag} you lost $${money}! You now have $${result.rawData.wallet} in your wallet!`);
        }, 3000);

    } else if ($ === $$ && $ === $$$) {
        setTimeout(async () => {
            const money = 10000;
            let result = await cs.addMoney({
                user: interaction.user,
                guild: interaction.guild, // { id: null }
                amount: money,
            });
            interaction.followUp(`Congrats, ${interaction.user.tag} you won $${money}! You now have $${result.rawData.wallet} in your wallet!`);
        }, 3000);

    } else {
        interaction.followUp("2 slots are equal... You were close but you lost! You won nothing!")
    }
    // SLots code ends here: //
    // Code by: https://github.com/ZariZaryab/SlotsMachine-DiscordJS
}


module.exports.help = {
    name: "slot",
    data: {
        name: 'slot',
        description: "SLOTS Game",
        options: []
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}