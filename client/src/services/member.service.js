import { URLS } from "../constant/apiUrls";
import ApiService from "./api.service";

export const MemberService = {
  getMembers(formData) {
    let axiosOptions = { params: formData };

    return ApiService.get(URLS.members, axiosOptions);
  },

  getMember(formData) {
    const { memberId } = formData;
    let axiosOptions = {};

    return ApiService.get(
      URLS.member.replace(":memberId", memberId),
      axiosOptions
    );
  },

  appMember(formData) {
    let axiosOptions = { data: formData };

    return ApiService.post(URLS.members, axiosOptions);
  },

  editMember(formData) {
    const { memberId, ...data } = formData;
    let axiosOptions = { data };

    return ApiService.patch(
      URLS.member.replace(":memberId", memberId),
      axiosOptions
    );
  },

  deleteMember(formData) {
    const { memberId } = formData;
    let axiosOptions = {};

    return ApiService.delete(
      URLS.member.replace(":memberId", memberId),
      axiosOptions
    );
  },
};
