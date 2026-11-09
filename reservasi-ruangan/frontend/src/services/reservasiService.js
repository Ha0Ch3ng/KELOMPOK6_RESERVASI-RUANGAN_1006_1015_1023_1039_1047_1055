// Service layer reservasi: 5 fungsi, mengembalikan response.data
import api from './api'

export const getAll = (params = {}) => api.get('/reservasi', { params }).then((r) => r.data)
export const getById = (id) => api.get(`/reservasi/${id}`).then((r) => r.data)
export const create = (data) => api.post('/reservasi', data).then((r) => r.data)
export const update = (id, data) => api.put(`/reservasi/${id}`, data).then((r) => r.data)
export const remove = (id) => api.delete(`/reservasi/${id}`).then((r) => r.data)
