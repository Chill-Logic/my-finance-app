import axios from 'axios';

import { LocalStorage } from '../../../services/storage';

export const getAxiosInstance = async() => {
	const token = await LocalStorage.getItem('token');

	const axiosInstance = axios.create({
		baseURL: 'https://8bec0208d967.ngrok-free.app/',
		headers: {
			'Access-Control-Allow-Origin': '*',
		},
	});

	if (token) {
		axiosInstance.defaults.headers.common.Authorization = `Bearer ${ token }`;
	}

	return axiosInstance;
};
