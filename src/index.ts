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

    public about: About;
    public links: Links;
    public requests: Requests;

    constructor(private config: IConfig) {
      this.genericClient = new QlikGenericRestClient(config);

      this.about = new About(this.genericClient);
      this.links = new Links(this.genericClient);
      this.requests = new Requests(this.genericClient);
    }
  }
}
