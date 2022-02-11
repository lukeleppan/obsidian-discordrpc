import { Client } from "discord-rpc";
import { FrontMatterCache, Plugin, PluginManifest, TFile } from "obsidian";
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

    if(this.settings.connectOnStart){
      await this.connectDiscord();

      let activeLeaf = this.app.workspace.activeLeaf;
      let files: TFile[] = this.app.vault.getMarkdownFiles();

      files.forEach((file) => {
        if (file.basename === activeLeaf.getDisplayText()) {
          this.onFileOpen(file);
        }
      });
    } else {
      this.setState(PluginState.disconnected);
      this.statusBar.displayState(this.getState(), this.settings.autoHideStatusBar);
    }
    
  }

  async onFileOpen(file: TFile) {
    this.currentFile = file;
    if (this.getState() === PluginState.connected) {
      await this.setActivity(
        this.app.vault.getName(),
        file
      );
    }
  }

  async onunload() {
    await this.saveData(this.settings);
    this.rpc.clearActivity();
    this.rpc.destroy();
  }

  async connectDiscord(): Promise<void> {
    this.loadedTime = new Date();
    
    this.rpc = new Client({
      transport: "ipc",
    });

    this.setState(PluginState.connecting);
    this.statusBar.displayState(this.getState(), this.settings.autoHideStatusBar);

    this.rpc.once("ready", () => {
      this.setState(PluginState.connected);
      this.statusBar.displayState(this.getState(), this.settings.autoHideStatusBar);
      this.logger.log("Connected to Discord", this.settings.showPopups);
    });

    try {
      await this.rpc.login({
        clientId: "763813185022197831",
      });
      await this.setActivity(this.app.vault.getName(), null);
    } catch (error) {
      this.setState(PluginState.disconnected);
      this.statusBar.displayState(this.getState(), this.settings.autoHideStatusBar);
      this.logger.log("Failed to connect to Discord", this.settings.showPopups);
    }
  }

  async disconnectDiscord(): Promise<void> {
    this.rpc.clearActivity();
    this.rpc.destroy();
    this.setState(PluginState.disconnected);
    this.statusBar.displayState(this.getState(), this.settings.autoHideStatusBar);
    this.logger.log("Disconnected from Discord", this.settings.showPopups);
  }

  async setActivity(
    vaultName: string,
    file: TFile
  ): Promise<void> {
    if (this.getState() === PluginState.connected) {
      let vault: string;
      if (this.settings.customVaultName === "") {
        vault = vaultName;
      } else {
        vault = this.settings.customVaultName;
      }

      let fileName: string = "...";
      if (file && this.settings.showFileExtension) {
        fileName = file.basename + "." + file.extension;
      } else {
        fileName = file.basename;
      }

      let date: Date;
      if (this.settings.useLoadedTime) {
        date = this.loadedTime;
      } else {
        date = new Date();
      }

      if (this.settings.showVaultName && await this.canShowFileName(file)) {
        await this.rpc.setActivity({
          details: `Editing ${fileName}`,
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
      } else if (await this.canShowFileName(file)) {
        await this.rpc.setActivity({
          details: `Editing ${fileName}`,
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
  async canShowFileName(file: TFile) {
    if (!file) return false;
    if (this.settings.showCurrentFileName) return false;
    
    const frontmatter = await this.app.metadataCache.getFileCache(file)?.frontmatter;
    if (frontmatter && "discord" in frontmatter) return frontmatter.discord;

    if (this.settings.exclude.some(path => new RegExp(`^${path}`).test(file.path))) return false;

    return true;
  }
}
