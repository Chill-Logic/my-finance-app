import { REACT_API_URL } from '@env';
import axios from 'axios';

import { LocalStorage } from '../../../services/storage';

export const getAxiosInstance = async() => {
	const token = await LocalStorage.getItem('token');

	const axiosInstance = axios.create({
		baseURL: REACT_API_URL,
	});

	if (token) {
		axiosInstance.defaults.headers.common.Authorization = `Bearer ${ token }`;
	}

	return axiosInstance;
};
