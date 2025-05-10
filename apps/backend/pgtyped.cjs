module.exports = {
	transforms: [
		{
			mode: "ts",
			include: "./data-access/*.repository.ts",
			emitTemplate: "{{dir}}/types/{{name}}.types.ts",
		},
	],
	srcDir: "./src/",
	failOnError: false,
	db: {
		host: "localhost",
		user: "test",
		dbName: "areeb_db",
		password: "test",
	},
};
