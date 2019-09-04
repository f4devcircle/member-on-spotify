require('dotenv').config();

const { getActivities } = require('./modules/spotify');
const { upsertActivities, getReadyToPublishActivity, getTrackCount } = require('./repositories/activity.repository');
const { sendTweet } = require('./modules/twitter');

const getNowPlaying = async () => {
	try {
		console.log(`get spotify's now playing`);
		const activities = await getActivities();
		await upsertActivities(activities);
	} catch (error) {
		console.log(error);
		return false;
	}
};

const publishToTwitter = async () => {
	try {
		console.log('publish to twitter');
		const activity = await getReadyToPublishActivity();
		if (activity) {
			await activity.update({ is_published: true });
			if (activity.member) await sendTweet(activity, await getTrackCount(activity.track_uri, activity.spotify_uri));
		}	
	} catch (error) {
		console.log(error);
		throw false
	}
};

const start = async () => {
	await getNowPlaying();
	await publishToTwitter();
}

start();

setInterval(async () => {
	start();
}, 1000*60*1);
