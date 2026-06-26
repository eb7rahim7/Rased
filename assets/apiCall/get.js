import { get } from "../api/get";
import { InfoConfig } from "../api/api_config";

const { appId } = InfoConfig();

export const getModelData = async ({ modelId, lang, props }) => {
  return await get({
    path: `application/${appId}/item_brief?model=${modelId}&language=${lang}&translate_original=1&api_all_result=1&field_name=1&result_structure_short=1${
      props ? props : ""
    }`,
  });
};
