const { Client, GatewayIntentBits, ActivityType } = require("discord.js");
const fetch = require("node-fetch");

// Konfiguracja z Environment Variables
const token = process.env.DISCORD_TOKEN;
const serverIP = process.env.SCP_IP;
const serverPort = process.env.SCP_PORT;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function getPlayerCount() {
  try {
    const response = await fetch(`https://api.scpslgame.com/serverinfo.php?ip=${serverIP}&port=${serverPort}`);
    const data = await response.json();
    if (data && data.players !== undefined) {
      return data.players;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Błąd pobierania danych:", err);
    return null;
  }
}

client.once("ready", () => {
  console.log(`Zalogowano jako ${client.user.tag}`);
  setInterval(async () => {
    const count = await getPlayerCount();
    if (count !== null) {
      client.user.setActivity(`${count} graczy online`, { type: ActivityType.Watching });
    } else {
      client.user.setActivity(`Brak danych`, { type: ActivityType.Watching });
    }
  }, 30000);
});

client.login(token);
