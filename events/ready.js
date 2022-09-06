const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
require("dotenv").config()

module.exports = {
    name: "ready",
    once: true,
    execute (client, commands) {
        //When bot loads
        console.log(`Logged in as ${client.user.tag}!`)

        const CLIENT_ID = process.env.CLIENT_ID

        const rest = new REST({
        version: "9"
        }).setToken(process.env.TOKEN);

        (async () => {
        try {
            if (process.env.ENV === "Production") {
            await rest.put(Routes.applicationCommands(CLIENT_ID), {
                body: commands
            })
            console.log("Seccessfully registered commands globaly.");
            } else {
            await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                body: commands
            })
            console.log("Seccessfully registered commands locally.");
            }
        } catch (err) {
            if (err) console.error(err);
        }
        })();
    }
}