import { URLS } from "../constant/apiUrls";
import ApiService from "./api.service";

export const GroupService = {
  getGroups(formData) {
    let axiosOptions = { params: formData };

    return ApiService.get(URLS.groups, axiosOptions);
  },

  getGroup(formData) {
    const { groupId } = formData;
    let axiosOptions = {};

    return ApiService.get(
      URLS.group.replace(":groupId", groupId),
      axiosOptions
    );
  },

  appGroup(formData) {
    let axiosOptions = { data: formData };

    return ApiService.post(URLS.groups, axiosOptions);
  },

  editGroup(formData) {
    const { groupId, ...data } = formData;
    let axiosOptions = { data };

    return ApiService.patch(
      URLS.group.replace(":groupId", groupId),
      axiosOptions
    );
  },

  deleteGroup(formData) {
    const { groupId } = formData;
    let axiosOptions = {};

    return ApiService.delete(
      URLS.group.replace(":groupId", groupId),
      axiosOptions
    );
  },

  addMemberInGroup(formData) {
    const { groupId, memberId } = formData;
    let axiosOptions = {};

    return ApiService.patch(
      URLS.groupMember
        .replace(":groupId", groupId)
        .replace(":memberId", memberId),
      axiosOptions
    );
  },

  addMultipleMemberInGroup(formData) {
    const { groupId, memberIds } = formData;
    let axiosOptions = { data: { memberIds } };

    return ApiService.post(
      URLS.groupMemberMultiple.replace(":groupId", groupId),
      axiosOptions
    );
  },

  removeMemberInGroup(formData) {
    const { groupId, memberId } = formData;
    let axiosOptions = {};

    return ApiService.delete(
      URLS.groupMemberRemove
        .replace(":groupId", groupId)
        .replace(":memberId", memberId),
      axiosOptions
    );
  },

  sendMails(formData) {
    const { groupId } = formData;
    let axiosOptions = {};

    return ApiService.post(
      URLS.sendMail.replace(":groupId", groupId),
      axiosOptions
    );
  },
};
