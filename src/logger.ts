import { Notice } from "obsidian";

export class Logger {

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
