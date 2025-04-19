import axios from "axios";


const apiUrl = "http://localhost:3000/api/";

export const getAtmList = async () => {
  try {
    const response = await axios.get(`${apiUrl}getAtmList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ATM list:", error);
    throw error;
  }
}

export const getAidList = async () => {
  try {
    const response = await axios.get(`${apiUrl}getAidList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching AID list:", error);
    throw error;
  }
}

export const getTransactionTypeList = async () => {
  try {
    const response = await axios.get(`${apiUrl}getTransactionTypeList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching transaction type:", error);
    throw error;
  }
}

export const getHostResponseList = async () => {
  try {
    const response = await axios.get(`${apiUrl}getHostResponseList`);
    return response.data;
  } catch (error) {
    console.error("Error fetching host response:", error);
    throw error;
  }
}

export const getTransactions = async (atmId: number, dateTime : number) => {
    try {
      const response = await axios.get(`${apiUrl}getTransactions`, { headers: {
        "Content-Type": "application/json",
        "atmId": atmId,
        "dateTime": dateTime,
      }});
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
}
