import { put } from "../api/put";
import { InfoConfig } from "../api/api_config";

const { appId } = InfoConfig();

export const putModelData = async ({ sendData, id, model }) => {
  return await put({
    path: `application/${appId}/item_data/${id}?model=${model}&ignore_container=1&by_field_code=1`,
    sendData,
  });
};
