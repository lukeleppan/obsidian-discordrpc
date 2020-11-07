import { Notice, Plugin } from "obsidian";
import { DiscordRPCSettings } from "./settings/settings";

export class Logger {
  private settings: DiscordRPCSettings;

  log(message: string, showPopups: boolean): void {
    if (showPopups) {
      new Notice(message);
    }

    console.log(`discordrpc: ${message}`);
  }

  logIgnoreNoNotice(message: string): void {
    new Notice(message);
    console.log(`discordrpc: ${message}`);
  }
}
