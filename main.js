const request = require("request")
const chalk = require("chalk")
const { base64encode } = require("nodejs-base64")
const { user_id, delay } = require("./config.json")

// validate the user id
if (isNaN(user_id)) return console.warn(`Error: "${user_id}" is not a valid number`)
if (user_id.toString().length != 18) return console.warn(chalk.red("Error: The provided user ID too short"))
if (Math.ceil(user_id) != user_id) return console.warn("Error: The user id cannot contain a decimal")
if (Math.abs(user_id) != user_id) return console.warn("Error: The user id cannot be a negative")

// user tokens usually start with the user id base64 encoded
function getFirstPart() {
    let result = base64encode(user_id).replace("==", "")
    return result = result += "."
}

// get the middle part of the token
function getMiddlePart() {
    let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    let result = ""
    for ( let i = 0; i < 6; i++ ) {
        result += char.charAt(Math.floor(Math.random() * char.length))
    }
    return result = result += "."
}

// and the hard part, the 3rd part
// we need to generate a 27 long string
function getLastPart() {
    let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_"
    let result = ""
    for ( let i = 0; i < 27; i++ ) {
        result += char.charAt(Math.floor(Math.random() * char.length))
    }
    return result
}

// now we check if the token we generated is valid
function validateToken() {
    let token = getFirstPart().concat(getMiddlePart(), getLastPart())
    return console.log(chalk.blueBright(`Invalid Token: ${token}`))
}

validateToken()
setInterval(() => {
    validateToken()
}, delay);