//*********************************************************************************************************************
//  Discord Bot Module: Bot Activity
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
//  npm i keyv
//  npm i croner
//
//--Dependencies-and-Variables---------------------------------------------------------------------------------------//
//
import { Cron } from 'croner';
import { activitydb } from './common/databases.mjs';
import cfg from './common/configs.json' with { type: 'json' };
//
//--Activity---------------------------------------------------------------------------------------------------------//
//
async function Activity(guild) {

	try {

		// Change activity status every 30 minutes
		const rotate = new Cron('*/30 * * * *', () => {

			ChangeBotActivity(guild);
		});
		
		if (await activitydb.get('init')) {
			
			SetBotActivity(guild);
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
async function ChangeBotActivity(guild) {

	try {

		if (!await activitydb.get('init')) {
			 await activitydb.set('init', true);
			 await activitydb.set('current', 0);
			 await activitydb.set('max', cfg.activity.text.length - 1);
		}
		else {

			await activitydb.set('max', cfg.activity.text.length - 1);
		
			if (await activitydb.get('current') < await activitydb.get('max')) {

				await activitydb.set('current', await activitydb.get('current') + 1);
			} 
			else {

				await activitydb.set('current', 0); 
			}
		}
		SetBotActivity(guild);

	} catch (error) {
		
		console.error('Error in activity.js:[ChangeBotActivity]');
		console.error(error);
	}
};
//
//--Set-Bot-Activity-------------------------------------------------------------------------------------------------//
//
async function SetBotActivity(guild) {

	try {

		const current = await activitydb.get('current');
		await guild.client.user.setActivity(cfg.activity.text[current], { type: cfg.activity.number[current] });

	} catch (error) {
		
		console.error('Error in activity.js:[SetBotActivity]');
		console.error(error);
	}
}
//
//--Export-----------------------------------------------------------------------------------------------------------//
//
export default Activity;
//
//--End-Of-Code------------------------------------------------------------------------------------------------------//

