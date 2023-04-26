export interface OdagConfigResponse {
  /**
   * The host on which the OdagService is running.
   */
  host: string;
  /**
   * The port on which the OdagService listens for REST calls.
   */
  port: number;
  /**
   * True if the OdagService is running in secure (SSL) mode.
   */
  secure: boolean;
  /**
   * Either http or https.
   */
  protocol: string;
  /**
   * The host of the QRS that the OdagService uses.
   */
  qrsHost: string;
  /**
   * The port of the QRS that the OdagService uses.
   */
  qrsPort: number;
  /**
   * The host of the Engine that the OdagService uses.
   */
  engineHost: string;
  /**
   * The port of the Engine that the OdagService uses.
   */
  enginePort: number;
  /**
   * The base path for the OdagService log files.
   */
  logPath: string;
  /**
   * The logging level.
   */
  logLevel: string;
  /**
   * Should log messages be output to console.
   */
  logToConsole: boolean;
  /**
   * The maximum number of concurrent ODAG Requests to process concurrently before queuing.
   */
  concurrentRequests: string;
  /**
   * The number of days to keep old OdagRequests and OdagLinks.
   */
  purgeOlderThan: number;
  /**
   * The interval (in minutes) of time that elapses between each cycle of looking for expired apps to delete.
   */
  appCleanupInterval: string;
  /**
   * The interval (in minutes) of time that elapses between each cycle of looking for expired links and requests to delete.
   */
  linkCleanupInterval: string;
}

export interface AboutResponse {
  /**
   * Service component name
   */
  service: string;
  /**
   * The service version number
   */
  componentVersion: string;
  /**
   * The version of the API
   */
  apiVersion: string;
  /**
   * True if the OdagService is enabled (false otherwise)
   */
  enabled: boolean;
  config: OdagConfigResponse;
}

export interface IsAvailableResponse {
  /**
   * 'true' if the current user has access to an operational ODAG service.
   */
  available: boolean;
  /**
   * 'true' if the dynamic view feature is enabled for the current user
   */
  dynamicViewEnabled?: boolean;
}

export interface CheckSettingsResponse {
  /**
   * 'true' if the OdagService global settings check was successful.
   */
  status: boolean;
}

export interface UserStateCondensed {
  /**
   * The system-assigned ID for a Qlik user.
   */
  id: string;
  userId: string;
  userDirectory: string;
  name: string;
}

export interface AppStateCondensed {
  /**
   * The system-assigned ID for an app.
   */
  id: string;
  /**
   * The name of an app.
   */
  name: string;
  appId: string;
  /**
   * A timestamp indicating when a significant event happened.
   */
  publishTime: string;
  /**
   * The system-assigned ID for a Qlik Sense Stream.
   */
  stream: string;
  savedInProductVersion: string;
  migrationHash: string;
  availabilityStatus: number;
}

/**
 * An expression based on the usage environment of a Link typically including predicates that test the current user's membership in a group or possession of a user role that when evaluated truthfully enables an applicable value for a Link property. For example, 'User_*' indicates that the LinkPropSetting applies to all users while User.name = joe' indicates the rule applies only to a specific user named 'joe'.
 */
export type LinkUsageContext = string;

export interface LinkPropTargetSheet {
  context: LinkUsageContext;
  /**
   * The ID of the sheet to first navigate to when opening the generated app from the selection app.
   */
  sheetId: string;
  /**
   * An optional, read-only property that is returned on a call to Link.LinkGet in the case that the 'targetSheet' Link property exists for the current user in the Link's 'properties' set and the sheet with that ID exists in the Link's templateApp.
   */
  sheetName?: string;
}

export interface LinkPropBase {
  context: LinkUsageContext;
}

export interface LinkPropHide extends LinkPropBase {
  hide: boolean;
}

export interface LinkPropDisable extends LinkPropBase {
  hide: boolean;
}

export interface LinkPropEphemeral extends LinkPropBase {
  isEphemeral: boolean;
}

export interface LinkPropCacheExpiry extends LinkPropBase {
  cacheLife: number;
}

/**
 * Sets the default method by which the newly generated app is displayed when opened. The default is 'Tab' to open a new tab in the same browser. Note that not all devices permit both methods so the chosen behavior may not apply if it is not supported on the user's device or browser.
 */
export interface LinkPropAppOpenMethod extends LinkPropBase {
  openMethod: "Tab" | "Window";
}

export interface LinkPropReloadSchedule extends LinkPropBase {
  schedule: string;
}

export interface LinkPropPublishTo extends LinkPropBase {
  /**
   * The ID of a stream in which to publish the generated app. If specified, the user creating or modifying the link must have publish permission on the stream at time of link creation or modification otherwise the request will be rejected. At runtime, the user must have read privilege on the stream in order to generate the app. If the Link owner no longer has publish privilege on the stream at the time the app is generated, a runtime error will occur
   */
  streamId: string;
  /**
   * An optional, read-only property containing the name of the stream in which to publish the generated app. This property is only returned on a Link.LinkGet call.
   */
  streamName?: string;
}

export interface LinkPropAppRetentionTime extends LinkPropBase {
  retentionTime: string;
}

export interface LinkPropLimitPolicy extends LinkPropBase {
  limitPolicy: "Restrict" | "AutoDelete";
}

export interface LinkPropGenAppLimit extends LinkPropBase {
  limit: number;
}

export interface LinkPropGenAppName extends LinkPropBase {
  /**
   * A string containing the base text of the name to use for the generated app and optionally any number of placeholder patterns of the form {N} where N is an integer greater than or equal to 0. The integer identifies the offset in the 'params' array of an AppNameParameter to evaluate at ODAG Request execution time to compute a fragment of the generated app's name and insert it at the same position as its corresponding %N placeholder. A string containing the base text of the name to use for the generated app and optionally any number of placeholder patterns of the form {N} where N is an integer greater than or equal to 0. The integer identifies the offset in the 'params' array of an AppNameParameter to evaluate at ODAG Request execution time to compute a fragment of the generated app's name and insert it at the same position as its corresponding %N placeholder.
   */
  formatString: string;
  /**
   * One of the allowed variables that, when evaluated at ODAG Request execution time, can be used to compute a part of a generated app's name. In addition to this list, the user can also supply a string of the form '$(<expr<)' where <expr< is an expression that is evaluated in the context of the selection app to produce a string.
   */
  params?: string[];
}

/**
 * The name of the Engine Group to queue all ODAG Requests to when this Link is traversed. [PREMIUM-VERSION-ONLY]
 */
export interface LinkPropEngineGroup extends LinkPropBase {
  /**
   * The ID for an EngineGroup.
   */
  engineGroupId: string;
}

/**
 * The default label to use for this Link in the context of the selection app's ODAG navigation menu.
 */
export interface LinkPropMenuLabel extends LinkPropBase {
  label: string;
}

/**
 * A link property that defines a value range that the evaluated value of the row estimate measure must fall within in order to allow submissions of a request for the link.
 */
export interface LinkPropRowEstRange extends LinkPropBase {
  /**
   * The minimum value for the row estimate to enable usage of the link to perform an ODAG request. If the row estimate expression evaluates to a number lower than this value, the user will be prevented from submitting an ODAG request for this link. If this value is not supplied, no minimum is required. format: int32
   */
  lowBound?: number;
  /**
   * The maximum value for the row estimate to enable usage of the link. If the row estimate expression evaluates to a value larger than this value, the user will be prevented from submitting an ODAG request for this link. format: int32
   */
  highBound: number;
}

export interface LinkProperties {
  /**
   * A link property that defines a value range that the evaluated value of the row estimate measure must fall within in order to allow submissions of a request for the link.
   */
  rowEstRange: LinkPropRowEstRange[];
  /**
   * The default label to use for this Link in the context of the selection app's ODAG navigation menu.
   */
  menuLabel?: LinkPropMenuLabel[];
  /**
   * The name of the Engine Group to queue all ODAG Requests to when this Link is traversed. [PREMIUM-VERSION-ONLY]
   */
  engineGroup?: LinkPropEngineGroup[];
  /**
   * An object that defines how to compute the name to use for the generated app.
   */
  genAppName?: LinkPropGenAppName[];
  /**
   * The limit to the number of apps generated using this specific Link that can exist, and still not deleted, before the policy defined by the appLimitPolicy property is applied. If no appLimitPolicy is defined, the 'Restrict' policy is assumed. If there is no value for this property applicable to the current user, there is no limit to the number of apps that can be generated from this link for the user. The count of the current number of apps is based on just those apps generated by the current user (and still in existence) for this specific link. The minimum value for this property is 1.
   */
  genAppLimit?: LinkPropGenAppLimit[];
  /**
   * The action to take when the limit to the maximum number of generated apps is reached.
   */
  limitPolicy?: LinkPropLimitPolicy[];
  /**
   * A string that defines the length of time that a generated app should be allowed to exist before it is automatically purged. The format must be in either ISO 8601 duration format or the text 'unlimited'.
   */
  appRetentionTime?: LinkPropAppRetentionTime[];
  /**
   * A stream in which to publish the generated app following successful app generation.
   */
  publishTo?: LinkPropPublishTo[];
  /**
   * A text string defining the reload schedule for an automatically-created scheduler task for apps generated app using this link. [TODO! Need to define the format for this string (e.g. crontab?)] The lack of a value for this property means no scheduler task will be created for the generated app. [PREMIUM-VERSION-ONLY]
   */
  reloadSchedule?: LinkPropReloadSchedule[];
  /**
   * Sets the default method by which the newly generated app is displayed when opened. The default is 'Tab' to open a new tab in the same browser. Note that not all devices permit both methods so the chosen behavior may not apply if it is not supported on the user's device or browser.
   */
  appOpenMethod?: LinkPropAppOpenMethod[];
  /**
   * The duration of time, in seconds, starting from the time at which a previously produced app that was generated using the same Link and an identical selection state, for which the prior app can be used as a substitute for a freshly generated app. The lack of this property means that no prior generation of the app is suitable as a replacement and a new app will always be generated (unless the app generation limit has been reached and the limit policy is set to 'restrict'). [PREMIUM-VERSION-ONLY]
   */
  cacheExpiry?: LinkPropCacheExpiry[];
  /**
   * Set to 'true' to indicate that all apps generated using this link should be ephemeral and never stored to disk. [TODO! Requires session-app support in the Sense client and hub]. Note that if this property is 'true', the LinkPropAppRetentionTime property has no effect since the generated app will last only for the duration of the user's current session with the generated app (i.e. the generated app is never saved). [PREMIUM-VERSION-ONLY]
   */
  ephemeral?: LinkPropEphemeral[];
  /**
   * Set to 'true' to temporarily disable the use of this Link to generate apps.
   */
  disable?: LinkPropDisable[];
  /**
   * Set to 'true' to temporarily hide access to all usages of this Link. Note! It is the responsibility of the clients to consult this setting on a per-user, per-use case basis to actually hide the links and their client usages).
   */
  hide?: LinkPropHide[];
  /**
   * An optional property that a Link creator can specify to cause the client to navigate to a specific sheet in the generated app when opening the generated app from the selection app's nav point panel.
   */
  targetSheet?: LinkPropTargetSheet[];
}

export interface LinkStateFull {
  /**
   * The system-assigned ID for a model group.
   */
  id: string;
  /**
   * A timestamp indicating when a significant event happened.
   */
  createDate: string;
  /**
   * A timestamp indicating when a significant event happened.
   */
  modifiedDate: string;
  modifiedByUserName: string;
  /**
   * Condensed state of a Qlik Sense user returned in state of ownable ODAG entities (e.g. ModelGroup, Link and EngineGroup).
   */
  owner: UserStateCondensed;
  /**
   * The name of a model group.
   */
  name: string;
  /**
   * The current status of a link.
   */
  status: string;
  /**
   * Condensed state of app returned in state if Link, LinkUsage, Request and ODAG App GET calls.
   */
  templateApp: AppStateCondensed;
  templateAppChartObjects?: {}[];
  /**
   * True if the odag link is a dynamic view otherwise false
   */
  dynamicView?: boolean;
  /**
   * A collection of Bindings. Note that there can be multiple bindings having the same 'templateAppFieldName' in a binding collection to denote different usages of the field's selection state in the context of the data prep logic but they all must have the same value for their 'range' property.
   */
  bindings: any[];
  /**
   * The complete set of possible properties for a link and their associated user context/value pairings.
   */
  properties: LinkProperties;
  modelGroups: string[];
  /**
   * Only returned on LinkGet and set to true if user will have access to an app generated by this link.
   */
  genAppAccessible?: boolean;
  privileges: string[];
}

/**
 * The format of the response returned from a LinkCreate or LinkUpdate operation.
 */
export interface LinkStateChangeResponse {
  objectDef: LinkStateFull;
  feedback?: {
    infoType: "INFO" | "WARN";
    content: string;
  }[];
}

/**
 * A JSON payload containing the contents to use for updating an existing link.
 */
export interface LinkModifyPayload {
  //   modifiedDate: string;
  name?: string;
  templateApp?: string;
  dynamicView?: boolean;
  rowEstExpr?: string;
  statusSetting?: string;
  bindings?: any[];
  properties?: LinkProperties;
  modelGroups?: string[];
}

/**
 * A JSON payload containing the content for a new ODAG link.
 */
export interface LinkAddPayload {
  /**
   * The name of a link.
   */
  name: string;
  /**
   * The system-assigned ID for an app.
   */
  selectionApp: string;
  /**
   * The system-assigned ID for an app.
   */
  templateApp?: string;
  /**
   * The odag link is treated as a dynamic view, app retention time is overridden to 24 hours and number of generated apps to 1
   */
  dynamicView?: boolean;
  /**
   * The measure expression to be evaluated in the context of the selection app for the link that estimates the number of records that will be qualified by the primary load query of the template app. This expression must be a valid expression in the context of the selection apps fields and update whenever the selection state of the selection app changes.
   */
  rowEstExpr?: string;
  /**
   * The valid set of status change types for a LinkCreate or LinkUpdate request. On a LinkCreate operation, the default value for this setting is 'activate'. On a LinkUpdate operation, the default behavior is to make no status changes unless the result of the update renders a Link to be completed and then the default status is set to active. In either the LinkCreate or LinkUpdate case, if the state of the Link following the changes is still missing properties required for it to support ODAG, the status will automatically be set to 'incomplete' regardless of the status value specified. It is the caller's responsibility to read the actual status value returned in the object. It is not possible to activate or disable a Link that is incomplete unless the changes supplied in the LinkUpdate call provide values for all required properties.
   */
  statusSettings?: string;
  /**
   * A collection of Bindings. Note that there can be multiple bindings having the same 'templateAppFieldName' in a binding collection to denote different usages of the field's selection state in the context of the data prep logic but they all must have the same value for their 'range' property.
   */
  bindings?: string[];
  /**
   * The complete set of possible properties for a link and their associated user context/value pairings.
   */
  properties?: LinkProperties;
  /**
   * The system-assigned ID for a model group.
   */
  modelGroups?: string[];
  /**
   * Determines if master charts of template app are included or not in the response
   */
  includeCharts?: boolean;
}

/**
 * Used to return a possibly empty LinkStateFull object when querying multiple Links by ID when any one of those IDs may be invalid or obsolete. If the 'link' field is missing in this object, it means that there was no Link for the corresponding ID.
 */
export interface OptLinkStateRef {
  /**
   * The system-assigned ID for a link.
   */
  id: string;
  /**
   * The full state of a Link.
   */
  link?: LinkStateFull;
}
