# Pixiv-Discord-Bot

Pixiv-Discord-Bot allows you to get illustrations from [Pixiv](https://www.pixiv.net/) on Discord servers.

![Result](images/result.png)

## Requirement

- Node.js > 16.6.0
- A self-hosted server
- A Discord developer account
- A Pixiv account

## Configuration

Create a `.env` file and fill in the variables shown below.

```
NODE_ENV=development
PORT=1234

# Your discord bot token
BOT_TOKEN=xxxxxxxxxxxxxxxxxxxxxxx
# Your application client ID
CLIENTID=xxxxxxxxxxxxxxxxxxxxxxx
# Your server ID for development
GUILD_ID=xxxxxxxxxxxxxxxxxxxxxxx

PIXIV_REFRESH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxx
```

For Pixiv refresh token, you can use [this script](https://gist.github.com/ZipFile/c9ebedb224406f4f11845ab700124362) written by [ZipFile](https://github.com/ZipFile) to retrieve it.

In the `config.ts` file, you can edit the bot's command prefix.

## Commands

Pixiv-Discord-Bot uses text commands and [slash commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) to interact with users. For text commands, bot works after users press `enter`. As for slash commands, when users type `/` in message bar on Discord, the commands show automatically.

![Slash commands](images/slash_command.png)

Commands are shown below:

### Text commands:

- `prefix`**help** - Show helps for the bot usage

### Slash commands:

- **/search latest `query` \[`number`\]** - Search first `number` latest illustrations by a query
- **/search popular `query` \[`number`\]** - Search first `number` popular illustrations by a query
- **/rank day \[`r18`\] \[`number`\]** - Return first `number` day ranking illustrations
- **/rank week \[`r18`\] \[`number`\]** - Return first `number` week ranking illustrations
- **/rank month \[`number`\]** - Return first `number` month ranking illustrations
- **/new \[`number`\]** - Return first `number` latest illustrations
- **/recommend \[`number`\]** - Return first `number` recommended illustrations
- **/followed \[`number`\]** - Return first `number` followed illustrations

## License

MIT
