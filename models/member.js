'use strict';

module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('member', {
		name: DataTypes.STRING,
		spotify_uri: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		previous_tweet_id: DataTypes.STRING,
  }, { timestamps: false });

  return Member;
};