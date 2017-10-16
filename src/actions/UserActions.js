import axios from 'axios';
import API_ROOT from '../constants';

import { AUTH_FAILED } from './BaseActions';

export const GET_USERS = 'GET_USERS';
export const CREATE_USER = 'CREATE_USER';
export const GET_USER = 'GET_USER';
export const UPDATE_USER = 'UPDATE_USER';
export const DELETE_USER = 'DELETE_USER';
export const EMPTY_USER = 'EMPTY_USER';
export const FORM_ERROR = 'FORM_ERROR';

/**
 * Get a list of users for a specific client.
 * @param {int} clientId - The id of a client for which to retrieve users.
 */
export async function getUsers(clientId) {
  let url;
  if (clientId) {
    url = `${API_ROOT}/clients/${clientId}/users/`;
  } else {
    url = `${API_ROOT}/users/`;
  }

  try {
    const request = await axios.create({
      headers: { 'X-CSRFToken': window.__STORE__.user.csrf },
      timeout: 3000,
      withCredentials: true
    });

    const result = await request.get(url);

    return {
      type: GET_USERS,
      payload: result
    };
  } catch (err) {
    return {
      type: AUTH_FAILED,
      payload: err
    };
  }
}

/**
 * Delete a user
 * @param {int} clientId - The id of a client of which the user belongs to.
 * @param {int} userId - The id of the to be deleted user.
 */
export async function deleteUser(clientId, userId) {
  const url = `${API_ROOT}/clients/${clientId}/users/${userId}`;

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

  // Use a request interceptor to intercept errors and send back the
  // right action type to our reducer.
  request.interceptors.response.use(
    response => {
      result = response;
      object = {
        type: DELETE_USER,
        payload: result,
        userId: userId
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

  result = await request.delete(url);

  return object;
}

export async function getUser() {
  const partnerId = window.__STORE__.user.partner.id;
  const userId = window.__STORE__.user.id;
  const url = `${API_ROOT}/partners/${partnerId}/users/${userId}`;

  try {
    const request = await axios.create({
      headers: { 'X-CSRFToken': window.__STORE__.user.csrf },
      timeout: 3000,
      withCredentials: true
    });

    const result = await request.get(url);

    return {
      type: GET_USER,
      payload: result
    };
  } catch (err) {
    return {
      type: AUTH_FAILED,
      payload: err
    };
  }
}

export async function updateUser(values) {
  const partnerId = window.__STORE__.user.partner.id;
  const userId = window.__STORE__.user.id;
  const url = `${API_ROOT}/partners/${partnerId}/users/${userId}`;

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
        type: UPDATE_USER,
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

export function emptyUser() {
  return {
    type: EMPTY_USER
  };
}