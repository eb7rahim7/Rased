import { InfoConfig } from "./api_config";
import { updateApiToken } from "../utility/globalFun";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toast } from "@backpackapp-io/react-native-toast";
const { mainUrl, jobsConfig, Authorization } = InfoConfig();

export const post = async ({
  path,
  sendData,
  isJobs,
  returnDataInError,
  dontShowMSG,
  countLevel,
  noMainUrl,
  extraHaeders,
  noMeta,
}) => {
  var headers = {
    "Content-Type": "application/json",
    ...extraHaeders,
  };
  var s_id = await AsyncStorage.getItem("s_id");
  var jwt = await AsyncStorage.getItem("jwt");
  var count = countLevel || 0;
  if (Authorization) {
    headers.Authorization = Authorization;
  }
  if (s_id && !noMeta) {
    headers.s_id = s_id;
    headers.sid = s_id;
  }
  if (jwt && !noMeta) {
    headers.jwt = jwt;
  }
  try {
    const res = await fetch(
      `${noMainUrl ? "" : isJobs ? jobsConfig : mainUrl}${path}`,
      {
        headers: headers,
        method: "POST",
        body: JSON.stringify(sendData),
        credentials: "omit",
      },
    );
    const data = await res.json();
    await updateApiToken(data);
    // if (data?.meta?.jwt_is_expired == true && count <= 1) {
    //   count += 1;
    //   return await post({
    //     path,
    //     sendData,
    //     isJobs,
    //     returnDataInError,
    //     dontShowMSG,
    //     countLevel: count,
    //   });
    // }
    if (!res.ok) {
      if (!dontShowMSG) {
        if (
          data?.meta &&
          data?.meta?.errors &&
          typeof data?.meta?.errors == "object"
        ) {
          Object.keys(data.meta.errors).map((err) => {
            toast.error(`${err}: ${data.meta.errors[err]}`);
          });
        } else if (typeof data?.meta?.errors == "string") {
          toast.error(data.meta.errors);
        } else {
          toast.error("failed");
        }
      }

      if (returnDataInError) {
        return { data, res };
      } else {
        return null;
      }
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
