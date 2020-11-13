import { Notice } from "obsidian";
import ObsidianDiscordRPC from "./main";

export class Logger {
  plugin: ObsidianDiscordRPC = (this as any).plugin;

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
