import { QlikGenericRestClient } from "qlik-rest-api";
import { URLBuild } from "./lib/util";
import {
  ReloadAppPayload,
  RequestModifyPayload,
  RequestStateFull,
} from "./types/interfaces";

export class Request {
  #id: string;
  #restClient: QlikGenericRestClient;
  details: RequestStateFull;
  constructor(
    private mainRestClient: QlikGenericRestClient,
    id: string,
    details?: RequestStateFull
  ) {
    this.#restClient = mainRestClient;
    this.#id = id;
  }

  async init() {
    if (!this.details) {
      this.details = await this.#restClient
        .Get<RequestStateFull>(`requests/${this.#id}`)
        .then((res) => res.data);
    }
  }

  /**
   * Perform some action on a request.
   *
   * This method is used to perform actions on requests such as pausing, resuming and canceling them. A 'single' or 'singlesub' request can be paused if it has not yet reached the data 'loading' phase. Cancel and pause actions can be performed on a 'multiple' app generation request that has at least one singlesub request that has not reached the 'loading' phase in which case the 'cancel' or 'pause' action applies to just that subset of sub-requests. The ODAG service will return an error if a request completes before a pause or cancel command is sent or acted upon.
   */
  public async update(arg: RequestModifyPayload) {
    if (!arg.action)
      throw new Error(`requests.update: "action" parameter is required`);

    const urlBuild = new URLBuild(`requests/${this.details.id}`);

    if (arg) {
      urlBuild.addParam("action", arg.action);
      urlBuild.addParam("optOwner", arg.delGenApp);
      urlBuild.addParam("type", arg.autoAck);
      urlBuild.addParam("includeCharts", arg.ignoreSucceeded);
    }

    return await this.#restClient
      .Put<RequestStateFull>(urlBuild.getUrl(), arg)
      .then((res) => res.data)
      .then((data) => (this.details = data));
  }

  /**
   * Delete the app generated by the request
   *
   * Deletes the generated app.
   */
  public async deleteGeneratedApp(): Promise<number> {
    return await this.#restClient
      .Delete(`requests/${this.#id}`)
      .then((res) => res.status);
  }

  /**
   * Reloads the app generated by the request
   *
   * Reloads the generated app.
   */
  public async reloadApp(arg: ReloadAppPayload): Promise<number> {
    return await this.#restClient
      .Post(`requests/${this.#id}/reloadApp`, arg)
      .then((res) => res.status);
  }

  /**
   * Rename the app generated by the request
   *
   * Rename the generated app.
   */
  public async renameApp(arg: {
    /**
     * The new name of the generated app.
     */
    appName: string;
  }): Promise<number> {
    if (!arg.appName)
      throw new Error(`request.renameApp: "appName" property is required`);

    return await this.#restClient
      .Post(`requests/${this.#id}/renameApp`, arg)
      .then((res) => res.status);
  }
}