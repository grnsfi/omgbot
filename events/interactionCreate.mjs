//*********************************************************************************************************************
//  Discord Bot Event: Interaction Create [Interaction Handler]
//
//  Author: GRNS | Git: GRNSFI
//
//  Version: [STABLE]
//
//  Last updated: 22.10.2025
//
//*********************************************************************************************************************
//--Needed-Packages--------------------------------------------------------------------------------------------------//
//
//  npm i discord.js
//
//--Dependencies-and-Variables---------------------------------------------------------------------------------------//
//
import {	
	
	Events,
	MessageFlags 

} from 'discord.js';
//
//--Common-Variables-------------------------------------------------------------------------------------------------//
//
const errormsg = '**OMGZOMG!**\n_An unknown error occurred while executing the command._';
//
//--Execute----------------------------------------------------------------------------------------------------------//
//
export default {
	
	name: Events.InteractionCreate,
	async execute(interaction) {
		
		try {

			if (interaction.commandName !== undefined) {

				const command = await interaction.client.commands.get(interaction.commandName);

				if (interaction.isChatInputCommand()) {

					if (!command) {
						
						console.error(`No slash command matching '${interaction.commandName}' was found.`);
						return;
					}	
					await command.execute(interaction);
				}
				else if (interaction.isUserContextMenuCommand()) {

					if (!command) {
						
						console.error(`No user context command matching '${interaction.commandName}' was found.`);
						return;
					}	
					await command.execute(interaction);
				}
				else if (interaction.isMessageContextMenuCommand()) {

					if (!command) {
						
						console.error(`No message context command matching '${interaction.commandName}' was found.`);
						return;
					}	
					await command.execute(interaction);
				}
			} else {

				const command = interaction.customId;

				if (interaction.isButton()) {

					// Do something..
				}
				else if (interaction.isModalSubmit()) {

					// Do something..
				}
				else {
					
					console.error('No command matching interaction found.');

					await interaction.reply({ content: `**OMGZOMG!**\n_No command matching interaction found._`, flags: MessageFlags.Ephemeral });
				}
			}
		} catch (error) {

			console.error('Error in interactionCreate.mjs:[Execute]');
			console.error(error);

			if (interaction.replied || interaction.deferred) {

				interaction.followUp({ content: errormsg, flags: MessageFlags.Ephemeral });
			}
			else {
	
				interaction.reply({ content: errormsg, flags: MessageFlags.Ephemeral });
			}
		}
	},
};
//
//--End-Of-Code------------------------------------------------------------------------------------------------------//


