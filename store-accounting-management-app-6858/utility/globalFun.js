import AsyncStorage from "@react-native-async-storage/async-storage";

export const updateApiToken = async (res) => {
  if (res?.meta?.token) {
    try {
      await AsyncStorage.setItem("jwt", res?.meta?.token);
    } catch (r) {}
  }
};

export const checkEvenOdd = (num) => {
  if (num % 2 === 0) {
    return "Even";
  } else {
    return "Odd";
  }
};
