import { InfoConfig } from "./api_config";
import { updateApiToken } from "../utility/globalFun";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "@backpackapp-io/react-native-toast";
const { mainUrl, Authorization } = InfoConfig();

export const put = async ({ path, sendData, dontShowMSG, countLevel }) => {
  var headers = {
    "Content-Type": "application/json",
  };
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
    const res = await fetch(`${mainUrl}${path}`, {
      headers: headers,
      method: "PUT",
      body: JSON.stringify(sendData),
      credentials: "omit",
    });
    const data = await res.json();
    await updateApiToken(data);
    if (data?.meta?.jwt_is_expired == true && count <= 1) {
      count += 1;
      return await put({
        path,
        sendData,
        dontShowMSG,
        countLevel: count,
      });
    }
    if (!res.ok) {
      if (!dontShowMSG) {
        if (data.meta && data.meta.errors) {
          Object.keys(data.meta.errors).map((err) => {
            toast.error(`${err}: ${data.meta.errors[err]}`);
          });
        } else {
          toast.error("failed");
        }
      }
      return null;
    }

    if (data && data.meta && data.meta.message && !dontShowMSG) {
      toast.success(data.meta.message);
    }

    return { data, res };
  } catch (e) {
    toast.error("something went wrong please try again later");
    return null;
  }
};
