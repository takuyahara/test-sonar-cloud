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
  public constructor(apiKey: string, user?: IUser) {
    this.configCatClient = configcat.createClientWithLazyLoad(apiKey);
    this.myUser = user;
  }
  public setDefaultConfig(defaultConfig: IConfig): ConfigCat {
    this.defaultConfig = defaultConfig;
    return this;
  }
  public load(callback: TCallback): void {
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
    Promise.all(loader)
      .then((results) => {
        // tslint:disable-next-line:no-any
        const loadedConfig = results.reduce((config: IConfig, result: any) => {
          const [key, value] = result;
          config[key] = value;
          return config;
        }, {});
        callback(loadedConfig);
      })
      .catch((error) => {
        callback(this.defaultConfig);
      });
  }
}
export default ConfigCat;
