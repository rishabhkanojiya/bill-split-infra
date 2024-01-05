import React, { useEffect, useRef, useState } from "react";
import { Route, Redirect, useHistory } from "react-router-dom";
import {
  LoginContext,
  ShowPopupContext,
  GroupContext,
  MemberContext,
} from "../../context";
import { Consume } from "../../context/Consumer";
import { UserService } from "../../services/user.services";
import { GroupService } from "../../services/group.service";
import { MemberService } from "../../services/member.service";
import Navbar from "../../components/Navbar";
import Loader from "../../components/Loader";
import { Box } from "@mui/material";

const AuthGuard = ({
  ShowPopupData,
  LoginData,
  GroupData,
  MemberData,
  component: Component,
  requiresAuth,
  ...rest
}) => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const navHeightref = useRef();

  const fetchUser = async () => {
    try {
      const userRes = await UserService.getUser();

      const user = await LoginData.setUserObj(userRes.data.user);

      const groupsRes = await GroupService.getGroups();
      GroupData.setGroups(groupsRes.data);

      const membersRes = await MemberService.getMembers();
      MemberData.setMembers(membersRes.data);
    } catch (err) {
      history.push("/auth/login");
      ShowPopupData.setPopupMessageObj(err.response.data, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (requiresAuth && !LoginData?.data?._id) {
      fetchUser();
    }
    setIsLoading(false);
  }, [requiresAuth, LoginData?.data?._id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        LoginData?.data?._id ? (
          <>
            <Navbar fwdRef={navHeightref} />
            <Box
              // sx={{ paddingBottom: `${navHeightref?.current?.clientHeight}px` }}
              sx={{ paddingBottom: `56px` }}
            >
              <Component {...props} />
            </Box>
          </>
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default Consume(AuthGuard, [
  ShowPopupContext,
  LoginContext,
  GroupContext,
  MemberContext,
]);
