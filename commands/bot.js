//********************************************************************************************************************
//  Discord Bot Command: Bot Status
//
//  Author: GRNS | Git: GRNSFI
//
//  Version: [STABLE]
//
// 	Last updated: 21.10.2025
//
//*********************************************************************************************************************
//--Needed-Packages--------------------------------------------------------------------------------------------------//
//
//  npm i discord.js
//
//--Dependencies-and-Variables---------------------------------------------------------------------------------------//
//
const { 

    MessageFlags,
	SlashCommandBuilder

} = require('discord.js');

const wait = require('timers/promises').setTimeout;
//
//--Common-Variables-------------------------------------------------------------------------------------------------//
//
const errormsg = '**OMGZOMG!**\n_An unknown error occurred while executing the command._';
//
//--Execute----------------------------------------------------------------------------------------------------------//
//
module.exports = {
	
	data: new SlashCommandBuilder()
		.setName('bot_status')
		.setDescription(`Check bot's status.`)
		.setContexts('Guild'),
		
	async execute(interaction) {
		
		try {
			
			const replymsg = `**I AM AWAKE!**\nReady to interact with you, **${interaction.user.displayName}!**`;

			await interaction.reply({ content: replymsg, flags: MessageFlags.Ephemeral });

			await wait(7500);
			await interaction.deleteReply();
		
		} catch (error) {
			
			console.error('Error in bot.js:[Execute]');
			console.error(error);

			if (interaction.replied || interaction.deferred) {

				interaction.followUp({ content: errormsg, flags: MessageFlags.Ephemeral });

			} else {

				interaction.reply({ content: errormsg, flags: MessageFlags.Ephemeral });
			}
		}
	},
};
//
//--End-Of-Code------------------------------------------------------------------------------------------------------//