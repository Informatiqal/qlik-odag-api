import { QlikGenericRestClient } from "qlik-rest-api";
import { URLBuild } from "./lib/util";
import {
  LinkModifyPayload,
  LinkRequestsQueryParams,
  LinkStateChangeResponse,
  LinkStateFull,
  RequestCreatePayload,
  RequestStateFull,
} from "./types/interfaces";
import { Request } from "./Request";

export class Link {
  #id: string;
  #restClient: QlikGenericRestClient;
  details: LinkStateFull;
  constructor(
    private mainRestClient: QlikGenericRestClient,
    id: string,
    details?: LinkStateFull
  ) {
    this.#restClient = mainRestClient;
    this.#id = id;
  }

  async init() {
    if (!this.details) {
      this.details = await this.#restClient
        .Get<LinkStateFull>(`links/${this.#id}`)
        .then((res) => res.data);
    }
  }

  public async update(arg: LinkModifyPayload) {
    return await this.#restClient
      .Put<LinkStateChangeResponse>(`links/${this.details.id}`, arg)
      .then((res) => res.data)
      .then((data) => (this.details = data.objectDef));
  }

  /**
   * Get a list of requests for a specific link.
   *
   * Return a list of ODAG requests for a specific link and that optionally match a set of conditions defined by a combination of additional optional parameters.
   */
  public async getRequests(arg?: LinkRequestsQueryParams): Promise<Request[]> {
    const urlBuild = new URLBuild(`links/${this.details.id}/requests`);

    if (arg) {
      urlBuild.addParam("clientContextHandle", arg.clientContextHandle);
      urlBuild.addParam("pending", arg.pending);
      urlBuild.addParam("selectionAppId", arg.selectionAppId);
      urlBuild.addParam("selectionAppSheet", arg.selectionAppSheet);
    }

    return await this.#restClient
      .Get<RequestStateFull[]>(urlBuild.getUrl())
      .then((res) => res.data)
      .then((data) => data.map((d) => new Request(this.#restClient, d.id, d)));
  }

  /**
   * Submit an ODAG request.
   *
   * This method submits a new app generation request to the ODAG service. This method attempts to validate the user's current selection app session state by applying the LinkPropSetting rules applicable to the user. If the validation succeeds, the request to create the application is queued and the method returns successfully with a summary of the created request (note that it is the caller's responsibility to monitor the status of the ODAG request using subsequent GET calls to the created request). If the validation fails, the method returns the 400 error code along with a relevant error object. If no 'engineGroup' property applies to this link and user combination, the data load phase of this request will be queued on the single engine queue for the same engine serving the selection app. If an engineGroup property does apply to the submitting user but the engine group does not exist or has been paused, the request validation will fail with an error.
   */
  public async submitRequest(arg: RequestCreatePayload): Promise<Request> {
    if (!arg.selectionApp)
      throw new Error(
        `link.submitRequest: "selectionApp" parameter is required`
      );
    if (!arg.actualRowEst)
      throw new Error(
        `links.submitRequest: "actualRowEst" parameter is required`
      );
    if (!arg.bindSelectionState)
      throw new Error(
        `links.submitRequest: "bindSelectionState" parameter is required`
      );

    return await this.#restClient
      .Put<RequestStateFull>(`links/${this.details.id}/requests`, arg)
      .then((res) => res.data)
      .then((data) => new Request(this.#restClient, data.id, data));
  }
}
