const discord = require("discord.js");
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.MessageContent,
    discord.GatewayIntentBits.GuildMessages,
  ],
  allowedMentions: {
    // parse: ['users', 'roles'],
    repliedUser: false,
  },
});
client.commands = new discord.Collection();
const { token, mongourl } = require("./config.json");
const CurrencySystem = require("currency-system");
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
process.on("uncaughtException", (_) =>
  console.error(_?.stack || _ + "\n" + "=".repeat(20))
);

for (const file of require("fs")
  .readdirSync("./src/commands")
  .filter((file) => file.endsWith(".js"))) {
  const command = require(`./commands/${file}`);
  if (command.help.data) client.commands.set(command.help.data.name, command);
}
// console.log(Array.from(client.commands).map(a => a[1].help.name).join(" "));
client.on("ready", () => {
  client.application.commands.set(
    Array.from(client.commands.values()).map((a) => a.help.data)
  );
  console.log(`${client.user.tag} is ready!`);
  client.user.setPresence({
    activities: [{ name: `Be Intelligent Code me`, type: 3 }],
    status: "dnd",
  });
});
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

Object.defineProperty(Array.prototype, "get", {
  value: function (arg) {
    const d = this.find((a) => a.name === arg);
    if (d && d.value) return d.value;
    else return null;
  },
});
