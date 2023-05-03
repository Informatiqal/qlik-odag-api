import { QlikGenericRestClient } from "qlik-rest-api";
import { IConfig } from "qlik-rest-api/dist/interfaces/interfaces";

import { About } from "./Global";
import { Links } from "./Links";
import { Requests } from "./Requests";

export namespace QlikODAGApi {
  export class client {
    /**
     * Instance of the underlying HTTP client that is not bound to the repository config
     */
    private genericClient: QlikGenericRestClient;

    public global: About;
    public links: Links;
    public requests: Requests;

    constructor(private config: IConfig) {
      const basePath: string = config.port == 9098 ? "v1" : "api/odag/v1";
      this.genericClient = new QlikGenericRestClient(config, basePath);

      this.global = new About(this.genericClient);
      this.links = new Links(this.genericClient);
      this.requests = new Requests(this.genericClient);
    }
  }
}
