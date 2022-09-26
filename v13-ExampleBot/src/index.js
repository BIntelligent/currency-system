const discord = require("discord.js");
const fs = require("fs");
const client = new discord.Client({
  intents: 32767, //[discord.Intents.FLAGS.GUILDS, 'GUILD_interactionS'],
  allowedMentions: {
    // parse: ['users', 'roles'],
    repliedUser: false,
  },
});
client.commands = new discord.Collection();
const {
  token,
  mongourl,
  guildID, // THIS is guildID of server which will have all slahs commands.
} = require("./config.json");
const CurrencySystem = require("currency-system");
const { get } = require("http");
const cs = new CurrencySystem();
// Debug logs! Help in finding issues!
CurrencySystem.cs
  .on("debug", (debug, error) => {
    console.log(debug);
    if (error) console.error(error);
  })
  .on("userFetch", (user, functionName) => {
    console.log(
      `( ${functionName} ) Fetched User:  ${
        client.users.cache.get(user.userID).tag
      }`
    );
  })
  .on("userUpdate", (oldData, newData) => {
    console.log("User Updated: " + client.users.cache.get(newData.userID).tag);
  });

// Login To discord Bot Client!
client.login(token);
// Set MongoDB URL!
cs.setMongoURL(mongourl);
// Set Default Bank Amount when a new user is created!
cs.setDefaultBankAmount(1000);
cs.setDefaultWalletAmount(1000);
//  Its bank space limit (can be changed according to per user) here 0 means infinite.
cs.setMaxBankAmount(10000);
// Set Default Maximum Amount of Wallet Currency a user can have! (can be changed according to per user) here 0 means infinite.
cs.setMaxWalletAmount(10000);
// Search for new npm package updates on bot startup! Latest version will be displayed in console.
cs.searchForNewUpdate(true);

process.on("unhandledRejection", (_) =>
  console.error(_.stack + "\n" + "=".repeat(20))
);

for (const file of require("fs")
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"))) {
  const command = require(`./commands/${file}`);
  if (command.help.data) client.commands.set(command.help.data.name, command);
}
// console.log(Array.from(client.commands).map(a => a[1].help.name).join(" "));
client.on("ready", () =>
  client.commands.set(
    Array.from(client.commands.values()).map((a) => a.help.data),
    guildID
  )
);
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.run(client, interaction, interaction.options._hoistedOptions);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.content == "?sendAllCommandsEmbed") {
    let abc = "";
    client.commands
      .map((a) => a.help.name)
      .sort((a, b) => a.localeCompare(b))
      .forEach(
        (a) =>
          (abc += `- [${a}](https://github.com/BIntelligent/currency-system/blob/main/v13-ExampleBot/src/commands/${a}.js)\n`)
      );
    const e = new discord.interactionEmbed();
    e.setTitle("All Currency System Commands");
    e.setColor("GREEN");
    e.setDescription(abc);
    let m = await client.channels.cache
      .get("864746778573012992")
      .interactions.fetch("927593982194778142");
    m.edit({
      embeds: [e],
    });
    interaction.channel.send("Done!");
  }
  if (["664560526218756117"].includes(interaction.author.id)) {
    if (!interaction.content.startsWith("?eval")) return;
    const embed = new discord.interactionEmbed();
    embed.setTimestamp();
    embed.setFooter(
      "Requested by " + interaction.author.username,
      interaction.author.displayAvatarURL({
        format: "png",
        dynamic: true,
      })
    );
    try {
      const code = interaction.content.slice(6);
      if (!code) return interaction.channel.send("Please include the code.");
      let evaled;

      // This method is to prevent someone that you trust, open the secret shit here.
      if (code.includes(`client.token`) || code.includes(`client.login`)) {
        evaled = "No";
      } else {
        try {
          if (code.includes("await"))
            evaled = eval("(async () => {" + code + "})()");
          else evaled = eval(code);
        } catch (err) {
          embed.setDescription(err);
          interaction.channel.send({
            embeds: [embed],
          });
        }
      }

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled, {
          depth: 0,
        });

      let output = clean(evaled);
      if (output.length > 2048) {
        for (let i = 0; i < output.length; i += 2048) {
          const toSend = output.substring(i, Math.min(output.length, i + 2048));
          const e2 = new discord.interactionEmbed()
            .setDescription(toSend)
            .setColor("YELLOW")
            .setTimestamp()
            .setFooter(
              "Requested by " + interaction.author.username,
              interaction.author.displayAvatarURL({
                format: "png",
                dynamic: true,
              })
            );

          interaction.channel.send({
            embeds: [e2],
          });
        }
      } else if (output.length < 2048) {
        embed.setDescription("```" + output + "```").setColor("GREEN");
      }

      interaction.channel.send({
        embeds: [embed],
      });
    } catch (error) {
      let err = clean(error);
      if (err.length > 2048) {
        for (let i = 0; i < err.length; i += 2048) {
          const toSend = err.substring(i, Math.min(err.length, i + 2048));
          const e2 = new discord.interactionEmbed()
            .setDescription(toSend)
            .setColor("YELLOW")
            .setTimestamp()
            .setFooter(
              "Requested by " + interaction.author.username,
              interaction.author.displayAvatarURL({
                format: "png",
                dynamic: true,
              })
            );

          interaction.channel.send({
            embeds: [e2],
          });
        }
      } else if (err.length < 2048) {
        embed.setDescription("```" + err + "```").setColor("RED");
      }

      interaction.channel.send({
        embeds: [embed],
      });
    }
  }
});

function clean(string) {
  if (typeof text === "string")
    return string
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203));
  else return string;
}

Object.defineProperty(Array.prototype, "get", {
  value: function (arg) {
    const d = this.find((a) => a.name === arg);
    if (d && d.value) return d.value;
    else return null;
  },
});
