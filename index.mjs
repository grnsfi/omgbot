//*********************************************************************************************************************
//  Old Man Games Bot aka OMGbot
//
//  Author: GRNS | Git: GRNSFI
//
//  Version: v1.0 [STABLE]
//
//  Last updated: 22.10.2025
//
//  Written using Node.js version v22.20.0 and ES Modules
//
//*********************************************************************************************************************
//--Needed-Packages--------------------------------------------------------------------------------------------------//
//
//  npm i discord.js
//  npm i log-timestamp
//
//--Clear-Console----------------------------------------------------------------------------------------------------//
//
console.clear();
//
//--Dependencies-and-Variables---------------------------------------------------------------------------------------//
//
import {

	REST,
	Client,
	Events,
	Routes,
	Collection 

} from 'discord.js';

import fs from 'node:fs';
import Loader from './loader.mjs';
import app from './configs/app.json' with { type: 'json' };

import 'log-timestamp';
//
//--Client-&-Rest----------------------------------------------------------------------------------------------------//
//
const client = new Client(app.options);
const rest   = new REST().setToken(app.token);
//
//--Deploy-Commands--------------------------------------------------------------------------------------------------//
//
const commands = [];

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.mjs'));

for (const file of commandFiles) {
	
	const data = await import('./commands/'+file);
	const command = data.default; 

	if ('data' in command && 'execute' in command) {

		client.commands.set(command.data.name, command);
		
		commands.push(command.data.toJSON());
	}
	else {

		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}
(async () => {

	try {

		if (app.rebuild.cmd) {

			// Flush global commands
			await rest.put(Routes.applicationCommands(app.clientId), { body: [] })
				.then(() => console.log('Successfully flushed all application commands.'))
				.catch(console.error);

			// Flush guild commands
			await rest.put(Routes.applicationGuildCommands(app.clientId, app.guildId), { body: [] })
				.then(() => console.log('Successfully flushed all guild commands.'))
				.catch(console.error);
		}
		console.log(`Started refreshing ${commands.length} application commands.`);

		const data = await rest.put(Routes.applicationCommands(app.clientId), { body: commands });

		console.log(`Successfully reloaded ${data.length} application commands.`);

	} catch (error) {

		console.error('Error in index.mjs:[REST]');
		console.error(error);
	}
})();
//
//--Deploy-Events----------------------------------------------------------------------------------------------------//
//
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.mjs'));

for (const file of eventFiles) {

	const data  = await import('./events/'+file); 
	const event = data.default;
	
	if (event.once) {

		client.once(event.name, (...args) => event.execute(...args));
	} 
	else {

		client.on(event.name, (...args) => event.execute(...args));
	}
}
//
//--Ready------------------------------------------------------------------------------------------------------------//
//
client.once(Events.ClientReady, async bot => {
	
	try {

		const guild = await bot.guilds.fetch(app.guildId);
		
        Loader(guild);
		
		console.log(`Logged in guild named '${guild.name}'.`);
		console.log(bot.user.username+' is online!');
	
	} catch (error) {
		
		console.error('Error in index.mjs:[ClientReady]');
		console.error(error);
	}
});
//
//--Login------------------------------------------------------------------------------------------------------------//
//
client.login(app.token);
//
//--Process-Listeners------------------------------------------------------------------------------------------------//
//
process.on('uncaughtException', (error) => {

	console.error('Unhandled Caught Exception:');
	console.error(error);
});
process.on('unhandledRejection', (error) => {

	console.error('Unhandled Promise Rejection:');
	console.error(error);
});
//
//--End-Of-Code------------------------------------------------------------------------------------------------------//

