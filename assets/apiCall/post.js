import { post } from "../api/post";
import { InfoConfig } from "../api/api_config";

const { appId } = InfoConfig();

export const postSignIn = async ({ sendData }) => {
  return await post({
    path: `application/${appId}/sign_in_guest?front_theme=brmej`,
    sendData: {
      ...sendData,
    },
  });
};

export const postSignup = async ({ sendData }) => {
  return await post({
    path: `application/${appId}/sign_up_guest?front_theme=brmej`,
    sendData: {
      ...sendData,
    },
    noMeta: true,
  });
};
