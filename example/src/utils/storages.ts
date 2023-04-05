import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InfoStoneCode } from './types';

export const saveStoneCode = async (value: number) => {
  try {
    return await AsyncStorage.setItem('@stoneCode_Key', String(value));
  } catch (e) {
    console.log(e);
  }
}

export const getStoneCode = async () => {
  try {
    return await AsyncStorage.getItem('@stoneCode_Key');
  } catch (e) {
    console.log(e);
  }
}

export const saveKey = async (value: string) => {
  try {
    return await AsyncStorage.setItem('@returnkey_Key', value);
  } catch (e) {
    console.log(e);
  }
}

export const getKey = async () => {
  try {
    return await AsyncStorage.getItem('@returnkey_Key');
  } catch (e) {
    console.log(e);
  }
}

export const saveValuePay = async (value: number) => {
  try {
    await AsyncStorage.setItem('@valuePay_Key', String(value));
    return true;
  } catch (e) {
    return false;
  }
}

export const getValuePay = async () => {
  try {
    return Number(await AsyncStorage.getItem('@valuePay_Key'));
  } catch (e) {
    return false
  }
}

export const saveStoneInfo = async (value: InfoStoneCode): Promise<InfoStoneCode> => {
  await AsyncStorage.setItem('@stoneInfo_Key', JSON.stringify(value));
  return value;
}

export const getStoneInfo = async (): Promise<InfoStoneCode | boolean> => {
  try {
    const data = await AsyncStorage.getItem('@stoneInfo_Key');
    if (data) {
      const dataObject: InfoStoneCode = JSON.parse(data);
      return dataObject;
    }
    return false;
  } catch (e) {
    return false
  }
}

export const saveScreenInUse = async (value: "creditScreen" | "portionScreen" | "mainScreen" | "payScreen" | "errorScreen" | "printScreen" | "errorScreenV2") => {
  await AsyncStorage.setItem('@screenUse_Key', value);
  return value;
}

export const getScreenInUse = async (): Promise<string> => {
  const data = await AsyncStorage.getItem('@screenUse_Key');
  if(data){
    return data;
  }

  return "mainScreen";
}