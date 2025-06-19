import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api/v1' });

export function loginRequest(data) {
    return api.post('/jwt/create/', data);
}

export function registerRequest(data) {
    return api.post('/users/', data, {
        headers: { 'Content-Type': 'application/json' },
    });
}

export function refreshToken(refresh) {
    return api.post('/jwt/refresh/', { refresh });
}

export function getUserMe(access) {
    return api.get('/users/me/', {
        headers: { Authorization: `Bearer ${access}` },
    });
}

export function updateUserMe(data, access) {
    return api.patch('/users/me/', data, {
        headers: { Authorization: `Bearer ${access}` },
    });
}

export function getCourses(access) {
  return api.get('/course/', {
    headers: {
      Authorization: `Bearer ${access}`
    },
  });
}

export function getCourse(id, access) {
  return api.get(`/course/${id}`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
}

export function createCourse(data, access) {
  const formData = new FormData();
  for (let key in data) {
    if (data[key]) {
      formData.append(key, data[key]);
    }
  }

  return api.post('/course/create', formData, {
    headers: {
      Authorization: `Bearer ${access}`
    },
  });
}

export function updateCourse(id, data, accessToken) {
  const formData = new FormData();
  for (let key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  }

  return api.patch(`/course/${id}/`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  });
}