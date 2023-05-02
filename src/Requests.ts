import { QlikGenericRestClient } from "qlik-rest-api";
import { RequestStateFull } from "./types/interfaces";
import { URLBuild } from "./lib/util";
import { Request } from "./Request";

export class Requests {
  #restClient: QlikGenericRestClient;
  constructor(private mainRestClient: QlikGenericRestClient) {
    this.#restClient = mainRestClient;
  }

  /**
   * Returns a list of ODAG request objects matching the combination of search criteria provided. Only a single ID parameter may be supplied in a single request but any combination of the other parameters may be included. The OptEngineGroupNamePattern and OptEngineGroupId further restricts the set of returned requests to those that are (or were) assigned to specific engine groups. These two engine group parameters are only supported in the premium version of the ODAG service and an error will be returned on any attempt to supply values for both parameters in the same method call.
   */
  public async getAll(arg?: {
    /**
     * The ID of a link to match objects to be returned.
     */
    optLinkId?: string;
    /**
     * An optional parameter for specifying the ID of a selection app.
     */
    optSelectAppId?: string;
    /**
     * A time range in which an object was created prior to the specified timestamp.
     */
    createdBefore?: string;
    /**
     * The name of the user who submitted the request.
     */
    user?: string;
    /**
     * Any combination of the following request state flags: q = queued, v = validating, i = invalid,c = canceled, h = hold/pending, l = loading, f = done but failed, s = done successfully, d = done (success or failed)
     */
    state?: string;
  }): Promise<Request[]> {
    const urlBuild = new URLBuild(`requests`);

    if (arg) {
      urlBuild.addParam("optLinkId", arg.optLinkId);
      urlBuild.addParam("optSelectAppId", arg.optSelectAppId);
      urlBuild.addParam("createdBefore", arg.createdBefore);
      urlBuild.addParam("user", arg.user);
      urlBuild.addParam("state", arg.state);
    }

    return await this.#restClient
      .Get<RequestStateFull[]>(urlBuild.getUrl())
      .then((res) => res.data)
      .then((data) => data.map((d) => new Request(this.#restClient, d.id, d)));
  }

  /**
   * Get the status of a request.
   * 
   * Use this method to query the status of a request. If the request is a multiple app gen request, the returned RequestStatus object will contain an embedded array of RequestStatus objects, one for each sub-request of the multiple app gen request.
   */
  public async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`requests.get: "id" parameter is required`);
    const request: Request = new Request(this.#restClient, arg.id);
    await request.init();

    return request;
  }
}
