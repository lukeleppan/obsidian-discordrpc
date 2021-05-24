import { Client } from "discord-rpc";
import { Plugin, PluginManifest, TFile } from "obsidian";
import { Logger } from "./logger";
import { DiscordRPCSettings, PluginState } from "./settings/settings";
import { DiscordRPCSettingsTab } from "./settings/settings-tab";
import { StatusBar } from "./status-bar";

export default class ObsidianDiscordRPC extends Plugin {
  public state: PluginState;
  public settings: DiscordRPCSettings;
  public statusBar: StatusBar;
  public rpc: Client;
  public logger: Logger = new Logger();
  public currentFile: TFile;
  public loadedTime: Date;

  setState(state: PluginState) {
    this.state = state;
  }

  getState(): PluginState {
    return this.state;
  }

  public getApp(): any {
    return this.app;
  }

  public getPluginManifest(): PluginManifest {
    return this.manifest;
  }

  async onload() {
    this.loadedTime = new Date();
    let statusBarEl = this.addStatusBarItem();
    this.statusBar = new StatusBar(statusBarEl);

    this.settings = (await this.loadData()) || new DiscordRPCSettings();

    this.registerEvent(
      this.app.workspace.on("file-open", this.onFileOpen, this)
    );

    this.registerDomEvent(statusBarEl, "click", async () => {
      if (this.getState() == PluginState.disconnected) {
        await this.connectDiscord();
      } else if (this.getState() == PluginState.connected){
        await this.disconnectDiscord();
      }
    });

    this.addSettingTab(new DiscordRPCSettingsTab(this.app, this));

    this.addCommand({
      id: "reconnect-discord",
      name: "Reconnect to Discord",
      callback: async () => await this.connectDiscord(),
    });

    this.addCommand({
      id: "disconnect-discord",
      name: "Disconnect from Discord",
      callback: async () => await this.disconnectDiscord(),
    })

    await this.connectDiscord();

    let activeLeaf = this.app.workspace.activeLeaf;
    let files: TFile[] = this.app.vault.getMarkdownFiles();

    files.forEach((file) => {
      if (file.basename === activeLeaf.getDisplayText()) {
        this.onFileOpen(file);
      }
    });
  }

  async onFileOpen(file: TFile) {
    this.currentFile = file;
    if (this.getState() === PluginState.connected) {
      await this.setActivity(
        this.app.vault.getName(),
        file.basename,
        file.extension
      );
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
      this.logger.log("Connected to Discord", this.settings.showPopups);
    });

    try {
      await this.rpc.login({
        clientId: "763813185022197831",
      });
      await this.setActivity(this.app.vault.getName(), "...", "");
    } catch (error) {
      this.setState(PluginState.disconnected);
      this.statusBar.displayState(this.getState());
      this.logger.log("Failed to connect to Discord", this.settings.showPopups);
    }
  }

  async disconnectDiscord(): Promise<void> {
    this.rpc.clearActivity();
    this.rpc.destroy();
    this.setState(PluginState.disconnected);
    this.statusBar.displayState(this.getState());
    this.logger.log("Disconnected from Discord", this.settings.showPopups);
  }

  async setActivity(
    vaultName: string,
    fileName: string,
    fileExtension: string
  ): Promise<void> {
    if (this.getState() === PluginState.connected) {
      let vault: string;
      if (this.settings.customVaultName === "") {
        vault = vaultName;
      } else {
        vault = this.settings.customVaultName;
      }

      let file: string;
      if (this.settings.showFileExtension) {
        file = fileName + "." + fileExtension;
      } else {
        file = fileName;
      }

      let date: Date;
      if (this.settings.useLoadedTime) {
        date = this.loadedTime;
      } else {
        date = new Date();
      }

      if (this.settings.showVaultName && this.settings.showCurrentFileName) {
        await this.rpc.setActivity({
          details: `Editing ${file}`,
          state: `Vault: ${vault}`,
          startTimestamp: date,
          largeImageKey: "logo",
          largeImageText: "Obsidian",
        });
      } else if (this.settings.showVaultName) {
        await this.rpc.setActivity({
          state: `Vault: ${vault}`,
          startTimestamp: date,
          largeImageKey: "logo",
          largeImageText: "Obsidian",
        });
      } else if (this.settings.showCurrentFileName) {
        await this.rpc.setActivity({
          details: `Editing ${file}`,
          startTimestamp: date,
          largeImageKey: "logo",
          largeImageText: "Obsidian",
        });
      } else {
        await this.rpc.setActivity({
          startTimestamp: date,
          largeImageKey: "logo",
          largeImageText: "Obsidian",
        });
      }
    }
  }
}
