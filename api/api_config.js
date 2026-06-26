import { ONEDAY_CONFIG } from "../onedayConfig/OneDayApiConfig";
const { mainUrl, appId, Authorization } = ONEDAY_CONFIG();
const Info = {
  mainUrl: mainUrl,
  jobsConfig: "https://jobs.1daycloud.com/api/",
  appId: appId,
  Authorization: Authorization,
};

export const InfoConfig = () => {
  return Info;
};
