import { PluginState } from "./settings/settings";

export class StatusBar {
  private statusBarEl: HTMLElement;

  constructor(statusBarEl: HTMLElement) {
    this.statusBarEl = statusBarEl;
  }

  displayState(state: PluginState, autoHide: boolean) {
    switch (state) {
      case PluginState.connected:
        this.displayConnected(autoHide ? 10000 : 0);
        break;
      case PluginState.connecting:
        this.statusBarEl.setText(`Connecting to Discord...`);
        break;
      case PluginState.disconnected:
        this.statusBarEl.setText(`\u{1F5D8} Reconnect to Discord`);
        break;
    }
  }

  displayConnected(timeout: number) {
    this.statusBarEl.setText(`\u{1F30D} Connected to Discord`);

    if (timeout && timeout > 0) {
      window.setTimeout(() => {
        this.statusBarEl.setText("");
      }, timeout);
    }
  }
}
