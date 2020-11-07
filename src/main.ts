import { Client } from "discord-rpc";
import { Plugin, TFile } from "obsidian";
import { DiscordRPCSettings, PluginState } from "./settings/settings";
import { DiscordRPCSettingsTab } from "./settings/settings-tab";
import { StatusBar } from "./status-bar";

export default class ObsidianDiscordRPC extends Plugin {
  public state: PluginState;
  public settings: DiscordRPCSettings;
  public statusBar: StatusBar;
  public rpc: Client;

  setState(state: PluginState) {
    this.state = state;
  }

  getState(): PluginState {
    return this.state;
  }

  async onload() {
    let statusBarEl = this.addStatusBarItem();
    this.statusBar = new StatusBar(statusBarEl);

    this.settings = (await this.loadData()) || new DiscordRPCSettings();

    this.registerEvent(
      this.app.workspace.on("file-open", this.onFileOpen, this)
    );

    this.registerInterval(
      window.setInterval(async () => {
        await this.connectDiscord();
      }, 60 * 1000)
    );

    this.registerDomEvent(statusBarEl, "click", async () => {
      if (this.getState() == PluginState.disconnected) {
        await this.connectDiscord();
      }
    });

    this.addSettingTab(new DiscordRPCSettingsTab(this.app, this));

    await this.connectDiscord();
  }

  async onFileOpen(file: TFile) {
    if (this.getState() == PluginState.connected) {
      await this.setActivity(this.app.vault.getName(), file.basename);
    }
  }

  async onunload() {
    await this.saveData(this.settings);
    this.rpc.clearActivity();
    this.rpc.destroy();
  }

  async connectDiscord(): Promise<void> {
    this.rpc = new Client({
      transport: "ipc",
    });

    this.setState(PluginState.connecting);
    this.statusBar.displayState(this.getState());

    this.rpc.once("ready", () => {
      this.setState(PluginState.connected);
      this.statusBar.displayState(this.getState());
    });

    try {
      await this.rpc.login({
        clientId: "763813185022197831",
      });
      await this.setActivity(this.app.vault.getName(), "...");
    } catch (error) {
      this.setState(PluginState.disconnected);
      this.statusBar.displayState(this.getState());
    }
  }

  async setActivity(vaultName: string, fileName: string): Promise<void> {
    if (this.settings.showVaultName && this.settings.showCurrentFileName) {
      await this.rpc.setActivity({
        details: `Editing ${fileName}`,
        state: `Vault: ${vaultName}`,
        startTimestamp: new Date(),
        largeImageKey: "logo",
        largeImageText: "Obsidian",
      });
    } else if (this.settings.showVaultName) {
      await this.rpc.setActivity({
        state: `Vault: ${vaultName}`,
        startTimestamp: new Date(),
        largeImageKey: "logo",
        largeImageText: "Obsidian",
      });
    } else if (this.settings.showCurrentFileName) {
      await this.rpc.setActivity({
        details: `Editing ${fileName}`,
        startTimestamp: new Date(),
        largeImageKey: "logo",
        largeImageText: "Obsidian",
      });
    } else {
      await this.rpc.setActivity({
        startTimestamp: new Date(),
        largeImageKey: "logo",
        largeImageText: "Obsidian",
      });
    }
  }
}
