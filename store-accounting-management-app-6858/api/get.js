import { updateApiToken } from "../utility/globalFun";
import { InfoConfig } from "./api_config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "@backpackapp-io/react-native-toast";
const { mainUrl, Authorization } = InfoConfig();

export const get = async ({
  path,
  sendRes,
  noMeta,
  noMainUrl,
  showMSG,
  countLevel,
}) => {
  var headers = {};
  var s_id = await AsyncStorage.getItem("s_id");
  var jwt = await AsyncStorage.getItem("jwt");
  var count = countLevel || 0;
  if (Authorization) {
    headers.Authorization = Authorization;
  }
  if (s_id) {
    headers.s_id = s_id;
    headers.sid = s_id;
  }
  if (jwt) {
    headers.jwt = jwt;
  }
  try {
    const res = await fetch(`${noMainUrl ? path : `${mainUrl}${path}`}`, {
      headers: noMeta ? {} : headers,
      credentials: "omit",
    });
    const data = await res.json();
    await updateApiToken(data);
    if (data?.meta?.jwt_is_expired == true && count <= 1) {
      count += 1;
      return await get({
        path,
        sendRes,
        noMeta,
        noMainUrl,
        showMSG,
        countLevel: count,
      });
    }
    if (!res.ok) {
      if (data.meta.errors) {
        Object.keys(data.meta.errors).map((err) => {
          toast.error(`${err}: ${data.meta.errors[err]}`);
        });
      }

      return null;
    }

    if (showMSG && data?.meta?.message) {
      // message.success(data.meta.message);
    }

    if (sendRes && data) {
      return { res, data };
    } else if (data) {
      return data;
    }
  } catch (e) {
    toast.error(`server error`);
    return null;
  }
};
