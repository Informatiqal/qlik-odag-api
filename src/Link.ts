import { QlikGenericRestClient } from "qlik-rest-api";
import {
  LinkModifyPayload,
  LinkStateChangeResponse,
  LinkStateFull,
} from "./types/interfaces";

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
}
