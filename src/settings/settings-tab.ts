import { PluginSettingTab, Setting } from "obsidian";
import { Logger } from "src/logger";
import ObsidianDiscordRPC from "src/main";

export class DiscordRPCSettingsTab extends PluginSettingTab {
  public logger: Logger = new Logger();

  display(): void {
    let { containerEl } = this;
    const plugin: ObsidianDiscordRPC = (this as any).plugin;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Discord Rich Presence Settings" });

    new Setting(containerEl)
      .setName("Show Vault Name")
      .setDesc(
        "Enable this to show the name of the vault you are working with."
      )
      .addToggle((boolean) =>
        boolean.setValue(plugin.settings.showVaultName).onChange((value) => {
          plugin.settings.showVaultName = value;
          plugin.saveData(plugin.settings);

          if (boolean.getValue()) {
            this.logger.logIgnoreNoNotice("Vault Name is now Visable");
          } else {
            this.logger.logIgnoreNoNotice("Vault Name is no longer Visable");
          }

          plugin.setActivity(this.app.vault.getName(), "...");
        })
      );

    new Setting(containerEl)
      .setName("Show Current File Name")
      .setDesc("Enable this to show the name of the file you are working on.")
      .addToggle((boolean) =>
        boolean
          .setValue(plugin.settings.showCurrentFileName)
          .onChange((value) => {
            plugin.settings.showCurrentFileName = value;
            plugin.saveData(plugin.settings);

            if (boolean.getValue()) {
              this.logger.logIgnoreNoNotice("File Name is now Visable");
            } else {
              this.logger.logIgnoreNoNotice("File Name is no longer Visable");
            }

            plugin.setActivity(this.app.vault.getName(), "...");
          })
      );

    new Setting(containerEl)
      .setName("Show Notices")
      .setDesc("Enable this to show connection Notices.")
      .addToggle((boolean) =>
        boolean.setValue(plugin.settings.showPopups).onChange((value) => {
          plugin.settings.showPopups = value;
          plugin.saveData(plugin.settings);

          if (boolean.getValue()) {
            this.logger.logIgnoreNoNotice("Notices Enabled");
          } else {
            this.logger.logIgnoreNoNotice("Notices Disabled");
          }

          plugin.setActivity(this.app.vault.getName(), "...");
        })
      );
  }
}
