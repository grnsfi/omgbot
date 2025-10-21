//*********************************************************************************************************************
//  Old Man Games Bot aka OMGbot
//
//  Author: GRNS | Git: GRNSFI
//
//  Version: v1.0 [STABLE]
//
//  Last updated: 21.10.2025
//
//  Written / Tested using Node.js version v22.20.0
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
const {

	REST,
	Client,
	Events,
	Routes,
	Collection

} = require('discord.js');

const {

    app,
	rebuild
	
} = require('./configs/app');

const fs = require('node:fs');
const path = require('node:path');
const Loader = require('./loader').Loader;

require('log-timestamp');
//
//--Client-&-Rest----------------------------------------------------------------------------------------------------//
//
const client = new Client(app.options);
const rest   = new REST().setToken(app.token);
//
//--Deploy-Commands--------------------------------------------------------------------------------------------------//
//
const  commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');  
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	
	const filePath = path.join(commandsPath, file);
	const command  = require(filePath);
	
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

		if (rebuild.cmd) {

			// Flush global commands
			await rest.put(Routes.applicationCommands(app.clientId), { body: [] })
				.then(() => console.log('Successfully flushed all application commands.'))
				.catch(console.error);

			// Flush guild commands
			await rest.put(Routes.applicationGuildCommands(app.clientId, app.guildId), { body: [] })
				.then(() => console.log('Successfully flushed all guild commands.'))
				.catch(console.error);
		};
		console.log(`Started refreshing ${commands.length} application commands.`);

		const data = await rest.put(Routes.applicationCommands(app.clientId), { body: commands });

		console.log(`Successfully reloaded ${data.length} application commands.`);

	} catch (error) {

		console.error('Error in index.js:[REST]');
		console.error(error);
	}
})();
//
//--Deploy-Events----------------------------------------------------------------------------------------------------//
//
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {

	const filePath = path.join(eventsPath, file);
	const event    = require(filePath);
	
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
		
		console.error('Error in index.js:[ClientReady]');
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