import AsyncStorage from '@react-native-async-storage/async-storage';

const app_name = 'my-wallet';
const buildKey = (key: string) => `${app_name}-${key}`;

export const LocalStorage = {
  setItem: async (key: string, value: string) => {
    const fullKey = buildKey(key);
    return AsyncStorage.setItem(fullKey, value);
  },

  getItem: async (key: string) => {
    const fullKey = buildKey(key);
    return AsyncStorage.getItem(fullKey);
  },

  deleteItem: async (key: string) => {
    const fullKey = buildKey(key);
    return AsyncStorage.removeItem(fullKey);
  },
};
