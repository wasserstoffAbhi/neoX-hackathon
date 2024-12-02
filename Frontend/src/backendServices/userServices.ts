import axios from "axios";
import { API_URL } from "../config/envConfig";

export const validateChatId = async (chatId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/userData`, { chatId });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const updateScore = async (chatId: string, points: number) => {
  try {
    const { data } = await axios.put(`${API_URL}/update-points`, {
      chatId,
      points,
    });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const getTransactionInfo = async (hash: string, chatId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/getTransactionInfo`, { hash, chatId });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const fillWallet = async (walletAddress: string, chatId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/fillWallet`, { walletAddress, chatId });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const getTransactionResponse = async (message: string, chatId: string, history: any) => {
  try {
    const { data } = await axios.post(`${API_URL}/getTransactionMessages`, { message, chatId, history });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const getWalletResponse = async (message: string, chatId: string, history: any) => {
  try {
    const { data } = await axios.post(`${API_URL}/queryWallet`, { message, chatId, history });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const getNeoXResponse = async (message: string, history: any) => {
  try {
    const { data } = await axios.post(`${API_URL}/getNeox`, { message, history });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const getSwamp = async () => {
  try {
    const { data } = await axios.post(`${API_URL}/swamp`);
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const claimSwamp = async (id: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/swamp`, { chatId: id });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const getAllAvatars = async (chatId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/avatars`, { chatId: chatId });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const buyAvatarCall = async (chatId: string, avatarId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/buyAvatar`, { chatId, avatarId });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const sellAvatarCall = async (chatId: string, avatarId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/sellAvatar`, { chatId, avatarId });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

export const setActiveAvatarCall = async (avatarId: string, chatId: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/activeAvatar`, { avatarId, chatId });
    return data;
  } catch (err: any) {
    return err.message;
  }
};

