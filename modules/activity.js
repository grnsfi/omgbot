//*********************************************************************************************************************
//  Discord Bot Module: Bot Activity
//
//  Author: GRNS | Git: GRNSFI
//
//  Version: [STABLE]
//
//  Last updated: 21.10.2025
//
//*********************************************************************************************************************
//--Needed-Packages--------------------------------------------------------------------------------------------------//
//
//  npm i keyv
//  npm i croner
//
//--Dependencies-and-Variables---------------------------------------------------------------------------------------//
//
const cwd  = process.cwd();
const Keyv = require('keyv').default;
const Cron = require('croner').Cron;
//
//--Common-Variables-------------------------------------------------------------------------------------------------//
//
let activity = require(cwd+'/configs/app').activity;
const cache  = new Keyv(`sqlite://${cwd}/databases/activity.sqlite`);
//
//--Activity---------------------------------------------------------------------------------------------------------//
//
async function Activity(guild) {

	try {

		// Change activity status every 30 minutes
		const rotate = new Cron('*/30 * * * *', () => {

			activity = require(cwd+'/configs/app').activity;

			ChangeBotActivity(activity, cache, guild);
		});
		
		if (await cache.get('init')) {
			
			SetBotActivity(activity, cache, guild);
		}
		else {

			rotate.trigger();
		}

	} catch (error) {
                        
        console.error('Error in activity.js:[Activity]');
        console.error(error);
    }
};
//
//--Change-Bot-Activity----------------------------------------------------------------------------------------------//
//
async function ChangeBotActivity(activity, cache, guild) {

	try {

		if (!await cache.get('init')) {
			 await cache.set('init', true);
			 await cache.set('current', 0);
			 await cache.set('max', activity.text.length - 1);
		}
		else {

			await cache.set('max', activity.text.length - 1);
		
			if (await cache.get('current') < await cache.get('max')) {

				await cache.set('current', await cache.get('current') + 1);
			} 
			else {

				await cache.set('current', 0); 
			}
		}
		SetBotActivity(activity, cache, guild);

	} catch (error) {
		
		console.error('Error in activity.js:[ChangeBotActivity]');
		console.error(error);
	}
};
//
//--Set-Bot-Activity-------------------------------------------------------------------------------------------------//
//
async function SetBotActivity(activity, cache, guild) {

	try {

		const current = await cache.get('current');
		await guild.client.user.setActivity(activity.text[current], { type: activity.number[current] });

	} catch (error) {
		
		console.error('Error in activity.js:[SetBotActivity]');
		console.error(error);
	}
}
//
//--Export-----------------------------------------------------------------------------------------------------------//
//
module.exports = { Activity };
//
//--End-Of-Code------------------------------------------------------------------------------------------------------//