import React, { useEffect, useState } from "react";
import {
  GroupContext,
  MemberContext,
  ShowPopupContext,
} from "../../../context";

import {
  CardActionArea,
  CardActions,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
} from "@mui/material";
import {
  AvTimer,
  Delete,
  Add,
  Edit,
  Email,
  ArrowBack,
} from "@mui/icons-material";
import { Consume } from "../../../context/Consumer";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { GroupService } from "../../../services/group.service";
import Loader from "../../Loader";
import MembersList from "../../Members/List";
import FabComp from "../../FabComp";
import { useDialog } from "../../../hooks/useDialog";
import MemberCheckbox from "../../MemberCheckbox";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const GroupInfo = ({ ShowPopupData, GroupData }) => {
  const { groupId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [reFetch, setReFetch] = useState(true);
  const history = useHistory();

  const {
    show: showMemberDialog,
    hide: hideMemberDialog,
    RenderDialog: RenderMembersDialog,
    isVisible,
  } = useDialog();

  const { name, subject, image, totalAmount, _id, members, reminder } =
    GroupData.group || {};

  const fetchGroup = async (groupId) => {
    try {
      const groupRes = await GroupService.getGroup({ groupId });
      GroupData.setGroup(groupRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      hideMemberDialog();
      setReFetch(false);
    }
  };

  useEffect(() => {
    // if (_.isEmpty(GroupData.group)) {
    // }
    reFetch && fetchGroup(groupId);
  }, [reFetch]);

  if (_.isEmpty(GroupData.group) && isLoading) {
    return <Loader />;
  }

  const deleteGroup = async () => {
    try {
      const resp = await GroupService.deleteGroup({
        groupId,
      });
      const groupsRes = await GroupService.getGroups();
      GroupData.setGroups(groupsRes.data);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const disableReminder = async () => {
    try {
      const resp = await GroupService.editGroup({
        groupId,
        ...GroupData.group,
        reminder: !reminder,
      });
      const groupsRes = await GroupService.getGroups();
      GroupData.setGroups(groupsRes.data);
      history.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  const sendMail = async () => {
    try {
      const resp = await GroupService.sendMails({
        groupId,
      });
      ShowPopupData.setPopupMessageObj(
        { message: "Email Sent Successfully" },
        "success"
      );
    } catch (err) {
      console.log(err);
      ShowPopupData.setPopupMessageObj(err.response.data, "error");
    }
  };

  const renderMembers = () => {
    const memberProps = {
      members: { items: members },
      isDelete: true,
      onSelect: async (memberId) => {
        try {
          const resp = await GroupService.removeMemberInGroup({
            groupId,
            memberId,
          });
        } catch (error) {
          console.log(error);
        } finally {
          setReFetch(true);
        }
      },
    };
    let icon = members?.length ? Edit : Add;
    return (
      <>
        <MembersList {...memberProps} />

        <Box
          sx={{
            position: "fixed",
            bottom: "12%",
            right: "20%",
          }}
        >
          <FabComp Icon={icon} pulseValue={true} handler={showMemberDialog} />
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ maxHeight: "100%" }}>
      <Card sx={{ maxWidth: "100%" }}>
        <CardActionArea>
          <ArrowBack
            fontSize="large"
            sx={{ position: "absolute", top: "2%", left: "2%" }}
            onClick={() => history.goBack()}
          />
          <CardMedia component="img" image={image} alt={name} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subject}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions
          disableSpacing
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <IconButton
              aria-label="share"
              color={reminder ? "success" : "error"}
              onClick={disableReminder}
            >
              <AvTimer />
            </IconButton>
          </div>
          <div>
            {!!members?.length && (
              <IconButton aria-label="share" onClick={sendMail}>
                <Email />
              </IconButton>
            )}
            <IconButton aria-label="share" color="error" onClick={deleteGroup}>
              <Delete />
            </IconButton>
          </div>
        </CardActions>
      </Card>
      {renderMembers()}
      <RenderMembersDialog heading="Members">
        <MemberCheckbox
          groupId={_id}
          members={members}
          setReFetch={setReFetch}
        />
      </RenderMembersDialog>
    </Box>
  );
};

export default Consume(GroupInfo, [ShowPopupContext, GroupContext]);
