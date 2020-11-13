import { PluginSettingTab, Setting, TFile } from "obsidian";
import { Logger } from "src/logger";
import ObsidianDiscordRPC from "src/main";

export class DiscordRPCSettingsTab extends PluginSettingTab {
  public logger: Logger = new Logger();

  display(): void {
    let { containerEl } = this;
    const plugin: ObsidianDiscordRPC = (this as any).plugin;

    containerEl.empty();
    containerEl.createEl("h2", { text: "Discord Rich Presence Settings" });

    containerEl.createEl("h3", { text: "Vault Name Settings" });
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

          let activeLeaf = this.app.workspace.activeLeaf;
          let files: TFile[] = this.app.vault.getMarkdownFiles();

          files.forEach((file) => {
            if (file.basename === activeLeaf.getDisplayText()) {
              plugin.onFileOpen(file);
            }
          });
        })
      );

    new Setting(containerEl)
      .setName("Set Custom Vault Name")
      .setDesc(
        "Change the vault name shown publicly. Leave blank to use your actual vault name."
      )
      .addText((text) =>
        text.setValue(plugin.settings.customVaultName).onChange((value) => {
          plugin.settings.customVaultName = value;
          plugin.saveData(plugin.settings);

          let activeLeaf = this.app.workspace.activeLeaf;
          let files: TFile[] = this.app.vault.getMarkdownFiles();

          files.forEach((file) => {
            if (file.basename === activeLeaf.getDisplayText()) {
              plugin.onFileOpen(file);
            }
          });
        })
      );

    containerEl.createEl("h3", { text: "File Name Settings" });
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

            let activeLeaf = this.app.workspace.activeLeaf;
            let files: TFile[] = this.app.vault.getMarkdownFiles();

            files.forEach((file) => {
              if (file.basename === activeLeaf.getDisplayText()) {
                plugin.onFileOpen(file);
              }
            });
          })
      );

    new Setting(containerEl)
      .setName("Show File Extension")
      .setDesc("Enable this to show file extension.")
      .addToggle((boolean) =>
        boolean
          .setValue(plugin.settings.showFileExtension)
          .onChange((value) => {
            plugin.settings.showFileExtension = value;
            plugin.saveData(plugin.settings);

            let activeLeaf = this.app.workspace.activeLeaf;
            let files: TFile[] = this.app.vault.getMarkdownFiles();

            files.forEach((file) => {
              if (file.basename === activeLeaf.getDisplayText()) {
                plugin.onFileOpen(file);
              }
            });
          })
      );
    containerEl.createEl("h3", { text: "Notice Settings" });
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

          let activeLeaf = this.app.workspace.activeLeaf;
          let files: TFile[] = this.app.vault.getMarkdownFiles();

          files.forEach((file) => {
            if (file.basename === activeLeaf.getDisplayText()) {
              plugin.onFileOpen(file);
            }
          });
        })
      );
  }
}
