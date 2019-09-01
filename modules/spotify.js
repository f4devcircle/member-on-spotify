const fs = require('fs');
const axios = require('axios');

const activityEndpoint = process.env.SPOTIFY_FRIEND_ACTIVITY_URL;
const authEndpoint = process.env.SPOTIFY_AUTH_URL;

const headerRequest = JSON.parse(fs.readFileSync('spotify-auth.json', 'utf8'));

const headers = (token) => {
  return {
    "Authorization": "Bearer " + token,
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en",
    "User-Agent": "Spotify/1.0.93 Win32/Windows 10 (10.0.17134; x64)",
    "Connection": "keep-alive",
    "Host": "spclient.wg.spotify.com"
  };
}

const auth = async () => {
	const response = await axios.get(authEndpoint, {
		headers: headerRequest,
	});
	return response.headers['set-cookie'][2].split(';')[0].replace('wp_access_token=', '');
};

const getActivities = async () => {
	const response = await axios.get(activityEndpoint, {
		headers: headers(await auth()),
	});

	return response.data.friends;
};

module.exports = {
	getActivities,
};
