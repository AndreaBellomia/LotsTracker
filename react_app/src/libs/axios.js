import axios from 'axios';

const BASE_URL = '/api/v1/';

const VALID_URLS = [];

class FetchApi {
  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      xsrfCookieName: 'csrftoken',
      xsrfHeaderName: 'X-CSRFTOKEN',
    });
  }

  buildFilteredUrl(url, filters) {
    const queryParams = Object.keys(filters)
      .map((key) => `${key}=${encodeURIComponent(filters[key])}`)
      .join('&');
    return [url, queryParams].join('&');
  }
}

export default FetchApi;

export class CustomerApi extends FetchApi {
  async getCustomersList(page = 1, search = '', order_by = '') {
    return await this.client.get(
      this.buildFilteredUrl(`customers?format=json&page=${page}`, {
        search: search,
        ordering: order_by,
      })
    );
  }

  async getCustomer(id) {
    return await this.client.get(`/customers/detail/${id}`);
  }

  async postCustomer(body) {
    return await this.client.post('/customers', { ...body });
  }

  async putCustomer(id, body) {
    return await this.client.put(`/customers/detail/${id}`, { ...body });
  }
}

export class SupplierApi extends FetchApi {
  async getSuppliersList(page = 1, search = '', order_by = '') {
    return await this.client.get(
      this.buildFilteredUrl(`suppliers?format=json&page=${page}`, {
        search: search,
        ordering: order_by,
      })
    );
  }

  async getSupplier(id) {
    return await this.client.get(`/suppliers/detail/${id}`);
  }

  async postSupplier(body) {
    return await this.client.post('/suppliers', { ...body });
  }

  async putSupplier(id, body) {
    return await this.client.put(`/suppliers/detail/${id}`, { ...body });
  }
}

class DocumentApi extends FetchApi {
  async getDocumentsList(page = 1, search = '', order_by = '') {
    return await this.client.get(
      this.buildFilteredUrl(`${this.documentsListUrl}?format=json&page=${page}`, {
        search: search,
        ordering: order_by,
      })
    );
  }

  async getDocument(id) {
    return await this.client.get(`${this.formGetUrl}/${id}`);
  }

  async postDocument(body) {
    return await this.client.post(this.formPostUrl, { ...body });
  }

  async putDocument(id, body) {
    return await this.client.put(`${this.formGetUrl}/${id}`, { ...body });
  }
}

export class CustomerApiDocument extends DocumentApi {
  constructor() {
    super();
    this.SuppliersListUrl = 'suppliers';
    this.documentsListUrl = 'customers/documents';

    this.formGetUrl = 'customers/documents/detail';
    this.formPostUrl = 'customers/documents/create';
    this.formPutUrl = this.formGetUrl;
  }
}

export class FromSupplierApiDocument extends DocumentApi {
  constructor() {
    super();
    this.documentsListUrl = 'suppliers/documents/from';

    this.formGetUrl = 'suppliers/documents/from/detail';
    this.formPostUrl = 'suppliers/documents/from/create';
    this.formPutUrl = this.formGetUrl;
  }
}

export class ToSupplierApiDocument extends DocumentApi {
  constructor() {
    super();
    this.documentsListUrl = 'suppliers/documents/to';

    this.formGetUrl = 'suppliers/documents/to/detail';
    this.formPostUrl = 'suppliers/documents/to/create';
    this.formPutUrl = this.formGetUrl;
  }
}

export class LottiApi extends FetchApi {
  async getWarehouseRegistryDetail(id) {
    return await this.client.get(`warehouse/registry/detail/${id}?format=json`);
  }
  async postWarehouseItems(body) {
    return await this.client.post('warehouse/registry', { ...body });
  }
  async putWarehouseItems(id, body) {
    return await this.client.put(`warehouse/registry/detail/${id}`, {
      ...body,
    });
  }
  async getWarehouseItemsLott(id) {
    return await this.client.get(`/warehouse/items/detail/${id}`);
  }
  async postWarehouseItemsLott(body) {
    return await this.client.post('/warehouse/items', { ...body });
  }
  async putWarehouseItemsLott(id, body) {
    return await this.client.put(`/warehouse/items/detail/${id}`, { ...body });
  }
}

export class ItemsTypeApi extends FetchApi {
  async getItemsList(search = '', order_by = '') {
    return await this.client.get(
      this.buildFilteredUrl('warehouse/registry?format=json', {
        search: search,
        ordering: order_by,
      })
    );
  }

  async getWarehouseItemDetail(id) {
    return await this.client.get(`warehouse/registry/detail/${id}?format=json`);
  }
}

export class ItemsApi extends FetchApi {
  async getWarehouseItemsList(page = 1, search = '', order_by = '') {
    return await this.client.get(
      this.buildFilteredUrl(`warehouse/items?format=json&page=${page}`, {
        search: search,
        ordering: order_by,
      })
    );
  }

  async getWarehouseItemsAvailable(page = 1, search = '', order_by = '') {
    return await this.client.get(
      this.buildFilteredUrl(`warehouse/items/A?format=json&page=${page}`, {
        search: search,
        ordering: order_by,
      })
    );
  }

  async getWarehouseItemsToReturn(page = 1, search = '', order_by = '') {
    return await this.client.get(
      this.buildFilteredUrl(`warehouse/items/A,E?format=json&page=${page}`, {
        search: search,
        ordering: order_by,
      })
    );
  }
}

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
