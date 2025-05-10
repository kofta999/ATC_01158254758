import { exec, execSync } from "node:child_process";

function runCommand(command) {
	try {
		execSync(command, { stdio: "inherit" });
	} catch (error) {
		console.error(`Error executing command: ${command}`, error);
		process.exit(1);
	}
}

// Function to nuke and reinitialize the database
function nukeAndInitDB() {
	console.log("Nuking and reinitializing the database...");

	// Drop the existing database
	runCommand(
		'docker exec -i areeb_pg psql -U test -d postgres -c "DROP DATABASE IF EXISTS areeb_db WITH (FORCE);"',
	);

	// Recreate the database
	runCommand(
		'docker exec -i areeb_pg psql -U test -d postgres -c "CREATE DATABASE areeb_db;"',
	);

	// Run the initialization scripts
	runCommand(
		"docker exec -i areeb_pg psql -U test -d areeb_db -f /docker-entrypoint-initdb.d/schema.sql",
	);
	runCommand(
		"docker exec -i areeb_pg psql -U test -d areeb_db -f /docker-entrypoint-initdb.d/seed.sql",
	);
}

// Initial Docker start
try {
	execSync("docker compose version", { stdio: "inherit" });
	execSync("docker compose up -d", { stdio: "inherit" });
} catch (error) {
	execSync("docker-compose up -d", { stdio: "inherit" });
}

// Nuke and reinitialize the database
nukeAndInitDB();

exec("bunx pgtyped -w -c config.json", { stdio: "inherit" });

execSync("bun run --hot src/index.ts", { stdio: "inherit" });
