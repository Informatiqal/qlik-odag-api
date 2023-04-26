import { QlikGenericRestClient } from "qlik-rest-api";
import {
  LinkAddPayload,
  LinkStateChangeResponse,
  LinkStateFull,
  OptLinkStateRef,
} from "./types/interfaces";
import { URLBuild } from "./lib/util";
import { Link } from "./Link";

export class Links {
  #restClient: QlikGenericRestClient;
  constructor(private mainRestClient: QlikGenericRestClient) {
    this.#restClient = mainRestClient;
  }

  /**
   * A Link object defines an on-demand data navigation path between a selection app
   * and a template app including the set of properties that control how
   * that data access occurs and under what conditions access is permitted.
   * The set of links returned by this method have properties that match the combination
   * of conditions defined by any of the supplied optional parameters:
   * 'optOwnedBy', 'optModelGroupId', 'optSelectAppId' and 'optTemplateAppId'
   */
  public async getAll(arg?: {
    /**
     * The userDirectory\userId to use to limit the set of returned objects to those owned by a specific user.
     */
    optOwner?: string;
    /**
     * The type of link.
     */
    type?: string;
    /**
     * Determines if master charts of template app are included or not in the response
     */
    includeCharts?: boolean;
  }): Promise<Link[]> {
    const urlBuild = new URLBuild(`links`);

    if (arg) {
      urlBuild.addParam("optOwner", arg.optOwner);
      urlBuild.addParam("type", arg.type);
      urlBuild.addParam("includeCharts", arg.includeCharts);
    }

    return await this.#restClient
      .Get<LinkStateFull[]>(urlBuild.getUrl())
      .then((res) => res.data)
      .then((data) => data.map((d) => new Link(this.#restClient, d.id, d)));
  }

  /**
   * Get the details of a link including its list of Bindings, Properties and status information.
   */
  public async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`links.get: "id" parameter is required`);
    const link: Link = new Link(this.#restClient, arg.id);
    await link.init();

    return link;
  }

  /**
   * Creates a new link that enables ODAG navigation from a designated selection app to an app that is instantiated by copying the designated template app, injecting values for bind variables harvested from the selection app and dynamically loaded with data using those bindings. The Bindings will be initialized by searching the load script of the template app for patterns of the form '$(od_FIELDNAME)[M-N]' where FIELDNAME is the name of a field in the model of the selection app and the optional pattern [M-N] identifies the lower bound M and the upper bound N for the number of values for that field which must be in the active selection state of the selection app for binding to occur. The active selection state defaults to 'selected' (i.e. green) unless the 'od' prefix is immediately followed by some combination of the letters 's', 'o' or 'x', in that order, specifically designating the 'selected', 'optional' (i.e. white) and/or 'excluded' (i.e. gray) groups of values to be harvested from the selection app's selection state. The Bindings of the LinkPayload override the properties of the corresponding field Bindings found in the script of the template app.
   */
  public async create(arg: LinkAddPayload): Promise<Link> {
    const urlBuild = new URLBuild(`links`);

    if (arg.includeCharts)
      urlBuild.addParam("includeCharts", arg.includeCharts);

    return await this.#restClient
      .Post<LinkStateChangeResponse>(urlBuild.getUrl(), arg)
      .then((res) => res.data)
      .then(
        (data) => new Link(this.#restClient, data.objectDef.id, data.objectDef)
      );
  }

  /**
   * Find out if current user can create links.
   *
   * Return an object containing 'canCreateLinks'. If either (or both) of the two parameters are passed, they are included in the test (e.g. does the user have permission to create a link using a specific template app and/or in the context of a specific selection app).
   */
  public async canCreate(arg?: {
    /**
     * An optional parameter for specifying the ID of a template app.
     */
    optTemplateAppId?: string;
    /**
     * An optional parameter for specifying the ID of a selection app.
     */
    optSelectAppId?: string;
    /**
     * Optional parameter which allows ODAG client to have OdagService test whether the selection app is not updatable and force a denial for LinkCreate privilege in that case. This parameter will be ignored if OptSelectAppId is not also supplied.
     */
    optDenyIfSelAppNotUpdatable?: boolean;
  }): Promise<boolean> {
    const urlBuild = new URLBuild(`links/cancreate`);

    if (arg) {
      urlBuild.addParam("optTemplateAppId", arg.optTemplateAppId);
      urlBuild.addParam("optSelectAppId", arg.optSelectAppId);
      urlBuild.addParam(
        "optDenyIfSelAppNotUpdatable",
        arg.optDenyIfSelAppNotUpdatable
      );
    }

    return await this.#restClient
      .Get<{ canCreateLinks: boolean }>(urlBuild.getUrl())
      .then((res) => res.data.canCreateLinks);
  }

  /**
   * Notify the OdagService of the current set of Links referenced by a specific selection app and return that subset of Links that the current user can access.
   *
   * To handle the case when a user copies a selection app, each selection app will retain a list of the references to Links it uses in a generic object that is recorded in the app itself. In order to keep track of these usages of links by multiple copies of selection apps, the client will use this API to notify the ODAG Service of the set of Links it retains in each app. This API should be called at least once any time a selection app is opened and once any time a link is added or removed from a selection app. This makes it possible to track usages of Links across selection apps, at least selection apps that are in use by the client. The response to this call will be filtered to include only those links that the current user has privileges to read. Note that a condensed form of these readable links is returned for each link which includes fields such as name, modifiedDate, owner, templateApp, rowEstExpr and status but not fields such as linkProperties or privileges. These more detailed fields should be obtained using a subsequent call to Link.LinkGet.
   */
  public async selAppLinkUsages(arg: {
    /**
     * The ID of a selection app.
     */
    selAppId: string;
    /**
     * A JSON payload containing an array of LinkIds.
     */
    linkUsagePayload: string[];
    /**
     * The type of link.
     */
    type?: string;
    /**
     * Determines if master charts of template app are included or not in the response
     */
    includeCharts?: boolean;
  }): Promise<OptLinkStateRef[]> {
    if (!arg.selAppId)
      throw new Error(
        `links.selAppLinkUsages: "selAppId" parameter is required`
      );

    if (!arg.linkUsagePayload)
      throw new Error(
        `links.selAppLinkUsages: "linkUsagePayload" parameter is required`
      );

    const urlBuild = new URLBuild(`links/${arg.selAppId}/selAppLinkUsages`);

    urlBuild.addParam("type", arg.type);
    urlBuild.addParam("includeCharts", arg.includeCharts);

    return await this.#restClient
      .Post<OptLinkStateRef[]>(urlBuild.getUrl(), arg.linkUsagePayload)
      .then((res) => res.data);
  }
}
