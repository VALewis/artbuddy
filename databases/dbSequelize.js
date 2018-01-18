// sequelize ============================
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = new Sequelize(process.env.database, process.env.appUser, process.env.password, {
	host: process.env.host,
	dialect: 'postgres'
})
sequelize
	.authenticate()
	.then(() => {
		console.log('Successful database connection');
	  })
	.catch(err => {
		console.error('Unsuccessful database connection', err);
	});


// database model definitions ==========
const User = sequelize.define('user_accounts', {
	fullname: { type: Sequelize.TEXT },
	email: { type: Sequelize.TEXT },
	password: { type: Sequelize.TEXT, allowNull: false },
	age: { type: Sequelize.INTEGER },
	gender: { type: Sequelize.TEXT },
	profile_img: { type: Sequelize.TEXT }
	}, {
	tableName: 'user_accounts',
	freezeTableName: true,
    timestamps: false
});

const Cultinterests = sequelize.define('cultural_interests', {
	art: { type: Sequelize.BOOLEAN },
	dance: { type: Sequelize.BOOLEAN },
	theatre: { type: Sequelize.BOOLEAN },
	music: { type: Sequelize.BOOLEAN }
	}, {
	tableName: 'cultural_interests',
	freezeTableName: true,
    timestamps: false
});

const Cultcard = sequelize.define('cultcard', {
	museumcard: { type: Sequelize.BOOLEAN },
	musicabo: { type: Sequelize.BOOLEAN },
	wap: { type: Sequelize.BOOLEAN },
	indie4t: { type: Sequelize.BOOLEAN },
	stadspas: { type: Sequelize.BOOLEAN },
	cineville: { type: Sequelize.BOOLEAN }
	}, {
	tableName: 'cultcard',
	freezeTableName: true,
    timestamps: false
});	

const Talkratio = sequelize.define('talkratio', {
	bla: { type: Sequelize.BOOLEAN },
	blabla: { type: Sequelize.BOOLEAN },
	blablabla: { type: Sequelize.BOOLEAN }
	}, {
	tableName: 'talkratio',
	freezeTableName: true,
    timestamps: false
});

const Agepref = sequelize.define('age_pref', {
	'20-30': { type: Sequelize.BOOLEAN },
	'31-40': { type: Sequelize.BOOLEAN },
	'41-50': { type: Sequelize.BOOLEAN },
	'51-60': { type: Sequelize.BOOLEAN },
	'61-70': { type: Sequelize.BOOLEAN },
	'71-80': { type: Sequelize.BOOLEAN },
	'81-90': { type: Sequelize.BOOLEAN }
	}, {
	tableName: 'age_pref',
	freezeTableName: true,
    timestamps: false
});	

const Genderpref = sequelize.define('gender_pref', {
	male: { type: Sequelize.BOOLEAN },
	female: { type: Sequelize.BOOLEAN },
	transgender: { type: Sequelize.BOOLEAN }
	}, {
	tableName: 'gender_pref',
	freezeTableName: true,
    timestamps: false
});

const Languages = sequelize.define('languages', {
	dutch: { type: Sequelize.BOOLEAN },
	english: { type: Sequelize.BOOLEAN },
	german: { type: Sequelize.BOOLEAN },
	french: { type: Sequelize.BOOLEAN },
	spanish: { type: Sequelize.BOOLEAN },
	italian: { type: Sequelize.BOOLEAN },
	russian: { type: Sequelize.BOOLEAN },
	arabic: { type: Sequelize.BOOLEAN }
	}, {
	tableName: 'languages',
	freezeTableName: true,
    timestamps: false
});	

const Suggestion = sequelize.define('suggestion', {
	timedate: { type: Sequelize.TEXT },
	type: { type: Sequelize.TEXT },
	eventname: { type: Sequelize.TEXT },
	location: { type: Sequelize.TEXT },
	url: { type: Sequelize.TEXT }
	}, {
	tableName: 'suggestion',
	freezeTableName: true,
    timestamps: false
});

// table associations =============

// Cultinterests.belongsTo(User, { 
// 	foreignKey: 'user_id' }) // adds user_id to Interests (references id of User)

Cultinterests.belongsTo(User, { foreignKey: 'user_id' }) // adds user_id to Interests (references id of User)
User.hasOne(Cultinterests);

Cultcard.belongsTo(User, { foreignKey: 'user_id' }) // adds user_id to Cultcard (references id of User)

Talkratio.belongsTo(User, { foreignKey: 'user_id' }) // adds user_id to Talkratio (references id of User)

Agepref.belongsTo(User, { foreignKey: 'user_id' }) // adds user_id to Agepref (references id of User)
User.hasOne(Agepref, { foreignKey: 'user_id' });

Genderpref.belongsTo(User, { 
	foreignKey: 'user_id' }) // adds user_id to Genderpref (references id of User)

Languages.belongsTo(User, { 
	foreignKey: 'user_id' }) // adds user_id to Languages (references id of User)
User.hasOne(Languages);

User.hasMany(Suggestion, { foreignKey: 'suggestion_id' }) // adds user_id to Suggestion (references id of User)

Suggestion.belongsToMany(User, { through: 'UserSuggestion', foreignKey: 'suggestion_id',  otherKey: 'user_id' }) 

module.exports = 
dbSeq = {
	User: User,
	Cultinterests: Cultinterests,
	Cultcard: Cultcard,
	Talkratio: Talkratio,
	Agepref: Agepref,
	Genderpref: Genderpref,
	Languages: Languages,
	Suggestion: Suggestion,
	sequelize: sequelize	
};