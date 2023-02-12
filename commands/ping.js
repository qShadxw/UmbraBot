// Imports
const { SlashCommandBuilder } = require("discord.js");

// Command
module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with the ping in milliseconds!"),
    async execute(interaction) {
        await interaction.reply("Pong!");
    }
}