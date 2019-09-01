const { activity, member } = require('../models');

const upsertActivities = async (array) => {
	const activities = array.map(async each => {
		const result = {
			spotify_uri: each.user.uri,
			artist: each.track.artist.name,
			track: each.track.name,
			track_uri: each.track.uri,
			listened_at: each.timestamp,
		};

		await activity.upsert(result, {
			updateOnDuplicate: true,
		});

		return result;
	});

	await Promise.all(activities);
};


const getTrackCount = async (trackUri, spotifyUri) => {
	const count = await activity.count({
		where: {
			track_uri: trackUri,
			spotify_uri: spotifyUri,

		}
	});

	return count;
}

const getReadyToPublishActivity = async () => {
	const act = await activity.findOne({
		where: {
			is_published: false,
		},
		limit: 1,
		order: [['listened_at', 'ASC']],
		include: [ member ],
	});
	return act;
};

module.exports = {
	upsertActivities,
	getTrackCount,
	getReadyToPublishActivity,
};
