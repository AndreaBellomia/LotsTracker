import axios from "axios";

const BASE_URL = "/api/v1/";

const VALID_URLS = [];

class FetchApi {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      xsrfCookieName: "csrftoken",
      xsrfHeaderName: "X-CSRFTOKEN",
    });
  }

  static buildFilteredUrl(url, filters) {
    const queryParams = Object.keys(filters)
      .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
      .join("&");
    return [url, queryParams].join("&");
  }

  async getWarehouseItems(search = "", order_by = "") {
    let dataResponse = undefined;
    await this.client
      .get(
        FetchApi.buildFilteredUrl("warehouse/registry?format=json", {
          search: search,
          ordering: order_by,
        })
      )
      .then((response) => {
        dataResponse = response.data;
      })
      .catch((error) => {
        throw new Error("Error during request: ", error);
      });
    return dataResponse;
  }
}

export default FetchApi;
