// Imports
const fileSystem = require("node:fs");
const filePath = require("node:path");
const { Client, Events, GatewayIntentBits, Collection} = require("discord.js");

// Client
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Commands
const commandsPath = filePath.join(__dirname, "commands");
const commandsFiles = fileSystem.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

client.commands = new Collection();

for (const file of commandsFiles) {

    const commandFilePath = filePath.join(commandsPath, file);
    const command = require(commandFilePath);

    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[ERROR] Command file ${commandFilePath} does not have the required information to construct a command. Missing "data" or "execute" property.`)
    }

}

// Logs when ready
client.once(Events.ClientReady, listener => {
    console.log(`Logged in as ${listener.user.tag}`);
});

// Command Handling
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.log(`[ERROR] No command which matches ${interaction.commandName}.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(`[ERROR] Failed to execute command ${interaction.commandName}. Log: ${error}`);
        await interaction.reply(`[ERROR] Failed to execute command ${interaction.commandName}.`);
    }
});

// Login
client.login(process.env.bot_token);