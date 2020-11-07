export class DiscordRPCSettings {
  showVaultName: boolean = true;
  showCurrentFileName: boolean = true;
  showPopups: boolean = true;
}

export enum PluginState {
  connected,
  connecting,
  disconnected,
}
