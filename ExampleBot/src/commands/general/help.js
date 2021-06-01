const Discord = require("discord.js");
const {
    settingFunction
} = require("@silent-coder/discord-cmd-handler");
exports.run = async (client, message, args) => {
    let prefix = settingFunction().prefix;
    if (!args[0]) {
        // This will turn the folder (category) into array.
        let module = client.helps.array();

        // This will hide a folder from display that includes "hide: true" in their module.json
        if (!settingFunction().owners.includes(message.author.id)) module = client.helps.array().filter(x => !x.hide);
        require("fs").readdir(require("path").join(__dirname, `./../`), (err, categories) => {
            const embed = new Discord.MessageEmbed()
                .setColor(0x1d1d1d)
                .setTimestamp(new Date())
                .setDescription(`Type \`${prefix}help [command]\` to get more specific information about a command.`)
                .setTitle("CurrencySystem Bot")
                .setAuthor("Bot made by Be Intelligent.!!")
                .setFooter(
                    "Requested by " + message.author.username,
                    message.author.displayAvatarURL({
                        format: "png",
                        dynamic: true
                    })
                )
            for (let i = 0; i < categories.length; i++) {
                for (let mod of module) {
                    // You can change the .join(" | ") to commas, dots or every symbol.          
                    embed.addField(`${categories[i]}`, `${mod.cmds.map(x => `\`${x}\``).join(" | ") || "No Commands Found!"}`);
                }
            }
            return message.channel.send(embed);
        });



    } else {
        let cmd = args[0];

        // If the user type the [command], also with the aliases.
        if (client.commands.has(cmd) || client.commands.get(client.aliases.get(cmd))) {
            let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
            let name = command.help.name; // The command name.
            let desc = command.help.description; // The command description.
            let cooldown = command.conf.cooldown + " second(s)"; // The command cooldown.
            let aliases = command.conf.aliases.join(", ") ? command.conf.aliases.join(", ") : "No aliases provided.";
            let usage = command.help.usage ? command.help.usage : "No usage provided.";
            let example = command.help.example ? command.help.example : "No example provided.";

            let embed = new Discord.MessageEmbed()
                .setColor(0x7289DA)
                .setTitle(name)
                .setDescription(desc)
                .setThumbnail(client.user.displayAvatarURL())
                .setFooter("[] optional, <> required. Don't includes these things while typing a command.")
                .addField("Cooldown", cooldown)
                .addField("Aliases", aliases, true)
                .addField("Usage", usage, true)
                .addField("Example", example, true)

            return message.channel.send(embed);
        } else {
            // If the user type the wrong command.
            return message.channel.send({
                embed: {
                    color: "RED",
                    description: "Unknown command."
                }
            });
        }
    }
}

exports.help = {
    name: "help",
    description: "Show a command list.",
    usage: "help [command]",
    example: "/help verify"
}

exports.conf = {
    aliases: ["?"],
    cooldown: 5
}