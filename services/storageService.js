import AsyncStorage from '@react-native-async-storage/async-storage';

export const save = async (key, value) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const load = async (key) => {
  const v = await AsyncStorage.getItem(key);
  return v ? JSON.parse(v) : null;
};