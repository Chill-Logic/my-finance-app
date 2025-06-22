import { API_URL } from '@env';
import axios from 'axios';

import { LocalStorage } from '../../../services/storage';

export const getAxiosInstance = async() => {
	const token = await LocalStorage.getItem('token');
	const axiosInstance = axios.create({
		baseURL: API_URL,
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	});

	if (token) {
		axiosInstance.defaults.headers.common.Authorization = `Bearer ${ token }`;
	}

	return axiosInstance;
};
