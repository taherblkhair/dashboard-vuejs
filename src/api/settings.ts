import { request } from './index'

export const clearCache = () => {
	return request('/cache-clear', {
		method: 'POST'
	})
}
