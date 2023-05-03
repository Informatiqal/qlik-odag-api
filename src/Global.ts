import { QlikGenericRestClient } from "qlik-rest-api";
import {
  AboutResponse,
  IsAvailableResponse,
  CheckSettingsResponse,
} from "./types/interfaces";

export class About {
  #restClient: QlikGenericRestClient;
  constructor(private mainRestClient: QlikGenericRestClient) {
    this.#restClient = mainRestClient;
  }

  /**
   * Gets the service name, version, configuration and enabled status of the OdagService
   */
  public async about(): Promise<AboutResponse> {
    return await this.#restClient
      .Get<AboutResponse>(`about`)
      .then((res) => res.data);
  }

  /**
   * Returns true if the ODAG Service is available for the caller.
   */
  public async isODAGAvailable(): Promise<IsAvailableResponse> {
    return await this.#restClient
      .Get<IsAvailableResponse>(`isodagavailable`)
      .then((res) => res.data);
  }

  /**
   * Notifies the OdagService that global settings have changed.
   */
  public async checkSettings(): Promise<boolean> {
    return await this.#restClient
      .Post<CheckSettingsResponse>(`checksettings`, {})
      .then((res) => res.data.status);
  }
}
