import { values } from "lodash";
import React, { useState } from "react";
import { GroupContext, LoginContext, MemberContext, ShowPopupContext } from ".";
import { apiError, apiErrorAPi } from "../constant/errors";

export const ShowPopupProvider = (props) => {
  let [messageObj, setMessage] = useState({});
  let [showPopup, setShowPopup] = useState(false);

  const setPopupMessageObjKey = (sKey, errorCodeP, callback) => {
    const val = apiError(sKey, errorCodeP);
    setMessage(val);
    setShowPopup(true);

    if (showPopup) {
      if (callback) {
        callback();
      }
    }
  };

  const setPopupMessageObj = (res, state) => {
    let msg;
    setShowPopup(true);
    switch (state) {
      case "error":
        if (res?.meta?.errors) {
          msg = values(res.meta.errors)[0];
        } else {
          msg = apiErrorAPi(res);
        }

        setMessage({ state, msg });
        break;

      case "success":
        msg = apiErrorAPi(res);
        setMessage({ state, msg });
        break;

      default:
        break;
    }
  };

  return (
    <ShowPopupContext.Provider
      value={{
        data: messageObj,
        showPopup,
        setPopupMessageObjKey,
        setPopupMessageObj,
        setShowPopup,
      }}
    >
      {props.children}
    </ShowPopupContext.Provider>
  );
};

export const LoginProvider = (props) => {
  const [user, setUser] = useState(null);
  const [dataLength, setDataLength] = useState(0);

  function setUserObj(userVal) {
    setUser(userVal);

    return userVal;
  }

  const delUserObj = () => {
    setUser(null);
  };

  return (
    <LoginContext.Provider
      value={{
        data: user,
        setUserObj,
        delUserObj,
        dataLength,
        setDataLength,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};

export const GroupProvider = (props) => {
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState({});

  const setGroupsFunc = (groups) => {
    setGroups(groups);

    return groups;
  };

  const setGroupFunc = (group) => {
    setGroup(group);

    return group;
  };

  return (
    <GroupContext.Provider
      value={{
        group,
        data: groups,
        setGroup: setGroupFunc,
        setGroups: setGroupsFunc,
      }}
    >
      {props.children}
    </GroupContext.Provider>
  );
};

export const MemberProvider = (props) => {
  const [members, setMembers] = useState([]);
  const [member, setMember] = useState({});

  const setMembersFunc = (members) => {
    setMembers(members);

    return members;
  };

  const setMemberFunc = (member) => {
    setMember(member);

    return member;
  };

  return (
    <MemberContext.Provider
      value={{
        member,
        data: members,
        setMember: setMemberFunc,
        setMembers: setMembersFunc,
      }}
    >
      {props.children}
    </MemberContext.Provider>
  );
};
