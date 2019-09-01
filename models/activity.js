'use strict';

module.exports = (sequelize, DataTypes) => {
  const Activity = sequelize.define('activity', {
		artist: DataTypes.STRING,
		spotify_uri: DataTypes.STRING,
		listened_at: 'TIMESTAMP',
		track: DataTypes.STRING,
		track_uri: DataTypes.STRING,
		is_published: DataTypes.BOOLEAN,
	}, { timestamps: false });
	
	Activity.associate = function(sequelize) {
    Activity.belongsTo(sequelize.member, { foreignKey: 'spotify_uri' })
  };

  return Activity;
};