//********************************************************************************************************************
//  Discord Bot Command: Bot Status
//
//  Author: GRNS | Git: GRNSFI
//
//  Version: [STABLE]
//
// 	Last updated: 22.10.2025
//
//*********************************************************************************************************************
//--Needed-Packages--------------------------------------------------------------------------------------------------//
//
//  npm i discord.js
//
//--Dependencies-and-Variables---------------------------------------------------------------------------------------//
//
import { 

    MessageFlags,
	SlashCommandBuilder

} from 'discord.js';

import { scheduler } from 'node:timers/promises';
//
//--Common-Variables-------------------------------------------------------------------------------------------------//
//
const errormsg = '**OMGZOMG!**\n_An unknown error occurred while executing the command._';
//
//--Execute----------------------------------------------------------------------------------------------------------//
//
export default {
	
	data: new SlashCommandBuilder()
		.setName('bot_status')
		.setDescription(`Check bot's status.`)
		.setContexts('Guild'),
		
	async execute(interaction) {
		
		try {
			
			const replymsg = `**I AM AWAKE!**\nReady to interact with you, **${interaction.user.displayName}!**`;

			await interaction.reply({ content: replymsg, flags: MessageFlags.Ephemeral });

			await scheduler.wait(7500);
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
