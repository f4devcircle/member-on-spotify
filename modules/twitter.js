const twit = require('twit');

const Twitter = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000,
})

const sendTweet = async (activity, count) => {
	const trackUri = (activity.track_uri.split(':'))[2];
	const message = `${activity.member.name} is currently listening to ${activity.track} by ${activity.artist} (count: ${count}) https://open.spotify.com/track/${trackUri}`;
	console.log(message);

	const post = await Twitter.post('statuses/update', {
		status: message,
		in_reply_to_status_id: activity.member.previous_tweet_id,
	});

	await activity.member.update({ previous_tweet_id: post.data.id_str });
};

module.exports = {
	sendTweet,
};
