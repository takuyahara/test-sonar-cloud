import * as configcat from 'configcat-node';

export type TConfigValue = boolean | string | number;
export interface IConfig {
  [s: string]: TConfigValue;
}
export type TCallback = (loadedConfig: IConfig) => void;
export interface IUser {
  identifier: string;
  email?: string;
  country?: string;
  custom?: {
    [key: string]: string;
  };
}

class ConfigCat {
  // tslint:disable-next-line:no-any
  private configCatClient: any;
  private myUser?: IUser;
  private defaultConfig: IConfig = {};
  private isAlreadyLoaded: boolean = false;
  public constructor(apiKey: string, user?: IUser) {
    this.configCatClient = configcat.createClientWithLazyLoad(apiKey);
    this.myUser = user;
  }
  // tslint:disable-next-line:no-any
  private runCallback(callback: any): void {
    if (!this.isAlreadyLoaded) {
      this.isAlreadyLoaded = true;
      callback();
    }
  }
  public setDefaultConfig(defaultConfig: IConfig): ConfigCat {
    this.defaultConfig = defaultConfig;
    return this;
  }
  public load(callback: TCallback, timeout?: number): void {
    if (Object.keys(this.defaultConfig).length === 0) {
      throw new Error(`Default config is not set. Please call setDefaultConfig before loading config.`);
    }
    const loader = Object.keys(this.defaultConfig).map((configName: string) => {
      return new Promise((resolve) => {
        // TODO: Make configName non-case-sensitive
        this.configCatClient.getValue(configName.toLowerCase(), undefined, (value: TConfigValue) => {
          resolve([configName, value]);
        }, this.myUser);
      });
    });
    // Set timeout function
    if (timeout !== undefined) {
      setTimeout(() => {
        this.runCallback(() => {
          callback(this.defaultConfig);
        });
      }, timeout);
    }

    // Load config
    Promise.all(loader)
      .then((results) => {
        this.runCallback(() => {
          // tslint:disable-next-line:no-any
          const loadedConfig = results.reduce((config: IConfig, result: any) => {
            const [key, value] = result;
            config[key] = value;
            return config;
          }, {});
          callback(loadedConfig);
        });
      })
      .catch(error => {
        this.runCallback(() => {
          callback(this.defaultConfig);
        });
      });
  }
}
export default ConfigCat;
