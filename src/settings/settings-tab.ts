import { ExtraButtonComponent, PluginSettingTab, Setting, TextComponent, TFile, TFolder } from "obsidian";
import { Logger } from "src/logger";
import ObsidianDiscordRPC from "src/main";
import { FolderSuggestionModal } from "./folder";

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

          plugin.setActivity(
            this.app.vault.getName(),
            plugin.currentFile
          );
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

          plugin.setActivity(
            this.app.vault.getName(),
            plugin.currentFile
          );
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

            plugin.setActivity(
              this.app.vault.getName(),
              plugin.currentFile
            );
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

            plugin.setActivity(
              this.app.vault.getName(),
              plugin.currentFile
            );
          })
      );

    let text: TextComponent, extra: ExtraButtonComponent;
    new Setting(containerEl).setName("Exclude Folders").setDesc("Select folders to exclude from displaying.").addText(t => {
        text = t;
        let folders = this.app.vault.getAllLoadedFiles().filter((f) => f instanceof TFolder && !plugin.settings.exclude.includes(f.path));
        const modal = new FolderSuggestionModal(plugin.app, text, (folders as TFolder[]));
        modal.onClose = () => {
            if (!text.inputEl.value) {
                extra.setDisabled(true);
            } else {
                extra.setDisabled(false)
            }
        }
    }).addExtraButton(b => {
        extra = b;
        b.setIcon("plus-with-circle").onClick(() => {
            plugin.settings.exclude.push(text.inputEl.value);
            plugin.saveData(plugin.settings);
            this.display();
        })
    })
    
    for (const path of plugin.settings.exclude) {
        new Setting(containerEl).setName(path).addExtraButton(b => b.setIcon('trash').onClick(() => {
            plugin.settings.exclude.remove(path);
            plugin.saveData(plugin.settings);
            this.display();
        }))
    }


    containerEl.createEl("h3", { text: "Time Settings" });
    new Setting(containerEl)
      .setName("Use Obsidian Total Time")
      .setDesc(
        "Enable to use the total time you have been using Obsidian, instead of the time spent editing a single file."
      )
      .addToggle((boolean) => {
        boolean.setValue(plugin.settings.useLoadedTime).onChange((value) => {
          plugin.settings.useLoadedTime = value;
          plugin.saveData(plugin.settings);

          plugin.setActivity(
            this.app.vault.getName(),
            plugin.currentFile
          );
        });
      });

    containerEl.createEl("h3", { text: "Status Bar Settings" });
    new Setting(containerEl)
      .setName("Automatically hide Status Bar")
      .setDesc(
        "Automatically hide status bar after successfully connecting to Discord."
      )
      .addToggle((boolean) => {
        boolean.setValue(plugin.settings.autoHideStatusBar).onChange((value) => {
          plugin.settings.autoHideStatusBar = value;
          plugin.saveData(plugin.settings);

          plugin.setActivity(
            this.app.vault.getName(),
            plugin.currentFile
          );
        });
      });

    containerEl.createEl("h3", { text: "Startup Settings" });
    new Setting(containerEl)
      .setName("Automatically Connect to Discord")
      .setDesc(
        "Automatically connect to Discord on startup. You can always click the status bar to manually connect."
      )
      .addToggle((boolean) => {
        boolean.setValue(plugin.settings.connectOnStart).onChange((value) => {
          plugin.settings.connectOnStart = value;
          plugin.saveData(plugin.settings);

          plugin.setActivity(
            this.app.vault.getName(),
            plugin.currentFile
          );
        });
      });

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

          plugin.setActivity(
            this.app.vault.getName(),
            plugin.currentFile
          );
        })
      );
  }
}
