import { InfoConfig } from "./api_config";
import { updateApiToken } from "../utility/globalFun";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "@backpackapp-io/react-native-toast";
const { mainUrl, Authorization } = InfoConfig();

export const del = async ({ path, sendData, countLevel, dontShowMSG }) => {
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
  if (sendData) {
    headers["Content-Type"] = "application/json";
  }
  try {
    const res = await fetch(`${mainUrl}${path}`, {
      headers: headers,
      method: "DELETE",
      credentials: "omit",
      ...(sendData
        ? {
            body: JSON.stringify(sendData),
          }
        : {}),
    });

    const data = await res.json();
    await updateApiToken(data);
    if (data?.meta?.jwt_is_expired == true && count <= 1) {
      count += 1;
      return await del({
        path,
        sendData,
        countLevel: count,
      });
    }
    if (!res.ok) {
      if (data.meta && data.meta.errors && !dontShowMSG) {
        Object.keys(data.meta.errors).map((err) => {
          toast.error(`${err}: ${data.meta.errors[err]}`);
        });
      } else if (!dontShowMSG) {
        toast.error("failed");
      }

      return null;
    }

    if (data && data.meta && data.meta.message && !dontShowMSG) {
      toast.success(data.meta.message);
    }

    return { res, data };
  } catch (e) {
    toast.error("something went wrong please try again later");
    return null;
  }
};
