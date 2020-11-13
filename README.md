## Obsidian Discord Rich Presence Plugin

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/lukeleppan/obsidian-discordrpc/Build%20Release?logo=github&style=for-the-badge) ![GitHub release (latest by date)](https://img.shields.io/github/v/release/lukeleppan/obsidian-discordrpc?style=for-the-badge) ![GitHub All Releases](https://img.shields.io/github/downloads/lukeleppan/obsidian-discordrpc/total?style=for-the-badge)

Update your Discord Status to show your friends what you are working on in Obsidian. With Discord Rich Presence.

![Rich Presence Preview](https://raw.githubusercontent.com/lukeleppan/obsidian-discordrpc/master/assets/presence.gif)

### Usage

After enabling the plugin in settings, your Discord status should show that you are using Obsidian.md.

If Discord isn't open, then you will see "Reconnect to Discord" at the botton of the screen. You can click that to attempt to reconnect. It will only connect if Discord is open.

You can also reconnect to discord rich presence via the `Reconnect to Discord` command in the command palette. If there is an issue.

### Features

- Updates your Discord Status with Obsidian info, **Vault Name** and/or **Current File Name**.
- Allows you to customise what info is shown.

### Settings

#### Vault Name Settings

- Toggle whether or not to show **Vault Name**
- Set a custom **Vault Name** to show publicly

#### File Name Settings

- Toggle whether or not to show **Current File Name**
- Toggle whether or not to show the current file **extension**

#### Time Settings

- Toggle Whether or not to use the total time you have been using Obsidian, instead of the time spent editing a single file.

#### Notice Settings

- Toggle whether or not to show **Connection Notices**

### Issues

If you have any issues or suggestions please create an **issue** or a **pull request**.

### Compatibility

This plugin currently requires Obsidian v0.9.10+

### Install

You can install the plugin via the Community Plugins tab within Obsidian.

#### Manually installing the plugin

- Copy over `main.js`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.
