require('dotenv').config();

const { getActivities } = require('./modules/spotify');
const { upsertActivities, getReadyToPublishActivity, getTrackCount } = require('./repositories/activity.repository');
const { sendTweet } = require('./modules/twitter');

const getNowPlaying = async () => {
	console.log(`get spotify's now playing`);
	const activities = await getActivities();

	await upsertActivities(activities);
};

const publishToTwitter = async () => {
	console.log('publish to twitter');
	const activity = await getReadyToPublishActivity();

	if (activity) {
		await activity.update({ is_published: true });
		if (activity.member) await sendTweet(activity, await getTrackCount(activity.track_uri, activity.spotify_uri));
	}
};

const start = async () => {
	try {
		await getNowPlaying();
		await publishToTwitter();
	} catch (error) {
		console.log(error);
	}
}

start();

setInterval(async () => {
	start();
}, 1000*60*1);
