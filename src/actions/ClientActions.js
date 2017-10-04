import axios from 'axios';
import API_ROOT from '../constants';
import { AUTH_FAILED } from './BaseActions';

export const GET_CLIENTS = 'GET_CLIENTS';
export const GET_CLIENTS_PARTNER = 'GET_CLIENTS_PARTNER';
export const CREATE_CLIENT = 'CREATE_CLIENT';
export const GET_CLIENT = 'GET_CLIENT';
export const UPDATE_CLIENT = 'UPDATE_CLIENT';
export const DELETE_CLIENT = 'DELETE_CLIENT';
export const FORM_ERROR = 'FORM_ERROR';
export const EMPTY_CLIENT = 'EMPTY_CLIENT';

export async function getClients(partner = null) {
  let url;

  if (partner) {
    url = `${API_ROOT}/clients/?partner=${partner}`;
  } else {
    url = `${API_ROOT}/clients/`;
  }

  try {
    const request = await axios.create({
      headers: { 'X-CSRFToken': window.__STORE__.user.csrf },
      timeout: 3000,
      withCredentials: true
    });

    const result = await request.get(url);

    return {
      type: GET_CLIENTS,
      payload: result
    };
  } catch (err) {
    return {
      type: AUTH_FAILED,
      payload: err
    };
  }
}

export function createClient(values) {
  const url = `${API_ROOT}/clients/`;

  values.created_at = Date.now();
  const request = axios.post(url, values);

  return {
    type: CREATE_CLIENT,
    payload: request
  };
}

export async function getClient(id) {
  const url = `${API_ROOT}/clients/${id}/`;

  try {
    const request = await axios.create({
      headers: { 'X-CSRFToken': window.__STORE__.user.csrf },
      timeout: 3000,
      withCredentials: true
    });

    const result = await request.get(url);

    return {
      type: GET_CLIENT,
      payload: result
    };
  } catch (err) {
    return {
      type: AUTH_FAILED,
      payload: err
    };
  }
}

export async function updateClient(values) {
  const { id } = values;
  const url = `${API_ROOT}/clients/${id}/`;

  const request = await axios.create({
    headers: {
      Accept: 'application/json',
      'X-CSRFToken': window.__STORE__.user.csrf
    },
    timeout: 3000,
    withCredentials: true
  });

  let result;
  let object;

  request.interceptors.response.use(
    response => {
      result = response;
      object = {
        type: UPDATE_CLIENT,
        payload: result
      };
    },
    error => {
      result = error.response.data;
      object = {
        type: FORM_ERROR,
        payload: result
      };
    }
  );

  result = await request.patch(url, values);

  return object;
}

export function deleteClient(id) {
  const url = `${API_ROOT}/clients/${id}`;
  const request = axios.delete(url);

  return {
    type: DELETE_CLIENT,
    payload: { id, request }
  };
}
