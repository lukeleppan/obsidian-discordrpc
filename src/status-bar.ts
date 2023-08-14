import { PluginState } from "./settings/settings";
import { moment } from 'obsidian';
import type { Moment } from 'moment';

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

  displayTimer(loadedTime: Date) {
    this.statusBarEl.setText(`\u{1F30D} ${StatusBar.millisecsToString(new Date().getTime() - loadedTime.getTime())}`);
  }

  displayConnected(timeout: number) {
    this.statusBarEl.setText(`\u{1F30D} Connected to Discord`);

    if (timeout && timeout > 0) {
      window.setTimeout(() => {
        this.statusBarEl.setText("");
      }, timeout);
    } else {
      window.setTimeout(() => {
        this.statusBarEl.setText(`\u{1F30D}`);
      }, 5000);
    }
  }

  /* Returns [HH:]mm:ss on the stopwatch
  https://github.com/grassbl8d/flexible-pomo-obsidian/blob/ae037e3710866863c5397f42af06c5540a807b10/src/timer.ts#L475
  */
  static millisecsToString(millisecs: number): string {
    let formattedCountDown: string;

    if (millisecs >= 60 * 60 * 1000) { /* >= 1 hour*/
        formattedCountDown = moment.utc(millisecs).format('HH:mm:ss');
    } else {
        formattedCountDown = moment.utc(millisecs).format('mm:ss');
    }

    return formattedCountDown.toString();
  }
}
