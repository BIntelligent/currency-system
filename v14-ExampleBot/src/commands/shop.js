const CurrencySystem = require("currency-system");
const cs = new CurrencySystem();
const {
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ComponentType,
} = require("discord.js");
const chunkSize = 10; // number of items per embed page
// 10 is max limit for embed fields
const timeout = 60 * 1000; // 60*1000 =  1 minute(s) in miliseconds
// timeout will be reset when user clicks on the button
module.exports.run = async (client, interaction, args) => {
  await interaction.deferReply();
  let result = await cs.getShopItems({
    guild: interaction.guild,
  });
  let arr = [];
  for (let key in result.inventory) {
    arr.push({
      name: `${parseInt(key) + 1} - **${result.inventory[key].name}:** for $${
        result.inventory[key].price
      }`,
      value: "Description: " + result.inventory[key].description,
    });
  }
  if (arr.length > chunkSize) {
    let arrayOfEmbeds = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      const chunk = arr.slice(i, i + chunkSize);

      const embed = new EmbedBuilder().setDescription("Shop!").addFields(chunk);
      arrayOfEmbeds.push(embed);
    }

    const button1 = new ButtonBuilder()
      .setCustomId("previousbtn")
      .setLabel("Previous")
      .setStyle("Danger");

    const button2 = new ButtonBuilder()
      .setCustomId("nextbtn")
      .setLabel("Next")
      .setStyle("Success");
    if (arrayOfEmbeds.length <= 0)
      return interaction.editReply("No items in shop!");
    await paginationEmbed(
      interaction,
      arrayOfEmbeds,
      [button1, button2],
      timeout
    );
  } else {
    const embed = new EmbedBuilder().setDescription("Shop!").addFields(arr);
    interaction.editReply({
      embeds: [embed],
    });
  }
};

module.exports.help = {
  name: "shop",
  data: {
    name: "shop",
    description: "A way to see shop",
    options: [],
  },
};

module.exports.conf = {
  aliases: [],
  cooldown: 5, // This number is a seconds, not a milliseconds.
  // 1 = 1 seconds.
};
// Copied from https://github.com/ryzyx/discordjs-button-pagination/blob/interaction/index.js
const paginationEmbed = async (
  interaction,
  pages,
  buttonList,
  timeout = 120000
) => {
  if (!pages) return console.log("Pages are not given.");
  if (!buttonList) return console.log("Need two buttons.");
  if (buttonList[0].style === "LINK" || buttonList[1].style === "LINK")
    return console.log("Link buttons are not supported.");
  if (buttonList.length !== 2) return console.log("Need two buttons.");

  let page = 0;

  const row = new ActionRowBuilder()
    .addComponents(buttonList[0])
    .addComponents(buttonList[1]);

  //has the interaction already been deferred? If not, defer the reply.
  if (interaction.deferred == false) await interaction.deferReply();

  const curPage = await interaction.editReply({
    embeds: [
      pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` }),
    ],
    components: [row],
    fetchReply: true,
  });

  const collector = await curPage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: timeout,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== interaction.user.id)
      i.reply(
        "You can't use this button! Run the command yourself to use this."
      );
    switch (i.customId) {
      case buttonList[0].data.custom_id:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case buttonList[1].data.custom_id:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      default:
        break;
    }
    await i.deferUpdate();
    await i.editReply({
      embeds: [
        pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` }),
      ],
      components: [row],
    });
    collector.resetTimer();
  });

  collector.on("end", (_, reason) => {
    if (reason !== "messageDelete") {
      const disabledRow = new ActionRowBuilder().addComponents(
        buttonList[0].setDisabled(true),
        buttonList[1].setDisabled(true)
      );
      curPage.edit({
        embeds: [
          pages[page].setFooter({ text: `Page ${page + 1} / ${pages.length}` }),
        ],
        components: [disabledRow],
      });
    }
  });

  return curPage;
};
