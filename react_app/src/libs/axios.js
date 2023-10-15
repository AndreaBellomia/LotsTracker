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
    return await this.client
      .get(
        FetchApi.buildFilteredUrl("warehouse/registry?format=json", {
          search: search,
          ordering: order_by,
        })
      )
  }



  async getWarehouseItemDetail(id) {
    return await this.client
      .get(`warehouse/registry/detail/${id}?format=json`)
  }

  async getWarehouseItemDetail(page=1, search = "", order_by = "") {
    return await this.client
      .get(
        FetchApi.buildFilteredUrl(`warehouse/items?format=json&page=${page}`, {
          search: search,
          ordering: order_by,
        })
      )
  }

  // Warehouse
  async getWarehouseRegistryDetail(id) {
    return await this.client
      .get(`warehouse/registry/detail/${id}?format=json`)
  }
  async postWarehouseItems(body) {
    return await this.client
      .post("warehouse/registry", {...body})
  }
  async putWarehouseItems(id, body) {
    return await this.client
      .put(`warehouse/registry/detail/${id}`, {...body})
  }
  async getWarehouseItemsLott(id) {
    return await this.client
      .get(`/warehouse/items/detail/${id}`)
  }
  async postWarehouseItemsLott(body) {
    return await this.client
      .post("/warehouse/items", {...body})
  }
  async putWarehouseItemsLott(id, body) {
    return await this.client
      .put(`/warehouse/items/detail/${id}`, {...body})
  }


  // Customers API methods
  async getCustomer(page=1, search = "", order_by = "") {
    return await this.client
      .get(
        FetchApi.buildFilteredUrl(`customers?format=json&page=${page}`, {
          search: search,
          ordering: order_by,
        })
      )
  }

  async getCustomerDocuments(page=1, search = "", order_by = "") {
    return await this.client
      .get(
        FetchApi.buildFilteredUrl(`customers/documents?format=json&page=${page}`, {
          search: search,
          ordering: order_by,
        })
      )
  }
}

export default FetchApi;

export function manageFetchError(error, formError, setFormError) {
  const newErrors = {};

  if (error.response.data) {
    Object.keys(error.response.data).forEach((key) => {
      newErrors[key] = error.response.data[key];
    });
  }

  setFormError({
    ...formError,
    ...newErrors,
  });
}