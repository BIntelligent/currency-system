const Discord = require('discord.js')
const CurrencySystem = require("currency-system");
const cs = new CurrencySystem;
module.exports.run = async (client, interaction, args) => {
    await interaction.deferReply();
    if (interaction.options.getInteger('price') < 1) return interaction.editReply("You can't add an item for less than 1$!");
    let result = await cs.addItem({
        guild: interaction.guild,
        inventory: {
            name: interaction.options.getString('name'),
            price: interaction.options.getInteger('price'),
            description: interaction.options.getString('description') || 'No Description'
        }
    });
    if (result.error) {
        if (result.type == 'No-Inventory-Name') return interaction.editReply('There was a error, Please enter item name to add.!')
        if (result.type == 'Invalid-Inventory-Price') return interaction.editReply('There was a error, invalid price!')
        if (result.type == 'No-Inventory-Price') return interaction.editReply('There was a error, You didnt specify price!')
        if (result.type == 'No-Inventory') return interaction.editReply('There was a error, No data recieved!')
    } else return interaction.editReply('Done! Successfully added `' + interaction.options.getString('name') + '` to the shop!')



}

module.exports.help = {
    name: "additem",
    data: {
        name: 'additem',
        description: "A way to additem to shop",
        options: [{
                name: 'name',
                type: 3,
                description: 'Name of Item.',
                required: true,
            }, {
                name: 'price',
                type: 4,
                description: 'Price of item',
                required: true,
            },

            {
                name: 'description',
                type: 3,
                description: 'Description of the item. (Can\'t be Changed later.)',
                required: false,
            }
        ]
    }
};

module.exports.conf = {
    aliases: [],
    cooldown: 5 // This number is a seconds, not a milliseconds.
    // 1 = 1 seconds.
}