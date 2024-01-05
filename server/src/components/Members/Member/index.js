import {
  Avatar,
  Box,
  Checkbox,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PaidIcon from "@mui/icons-material/Paid";

import React, { useState } from "react";
import { stringAvatar } from "../../../common/utils";
import { MemberService } from "../../../services/member.service";

const Member = ({ member, onSelect, isSelect, isDelete, isSelected }) => {
  const { name, email, mobile, paid, amount, _id } = member;
  const [Paid, setPaid] = useState(paid);

  const changePaid = async () => {
    try {
      setPaid(!Paid);

      await MemberService.editMember({
        memberId: _id,
        ...member,
        paid: !Paid,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar {...stringAvatar(name)} />
      </ListItemAvatar>

      <ListItemText
        primary={name}
        secondary={
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{ display: "inline" }}
              component="span"
              variant="body2"
              color="text.primary"
            >
              {email}
            </Typography>{" "}
            {mobile}
          </Box>
        }
      />
      {isSelect && (
        <Checkbox onChange={() => onSelect(_id)} checked={isSelected} />
      )}
      {isDelete && (
        <Box sx={{ marginRight: "-16px", display: "flex" }}>
          <IconButton
            aria-label="share"
            color={Paid ? "success" : "error"}
            onClick={changePaid}
          >
            <PaidIcon />
          </IconButton>
          <IconButton
            aria-label="share"
            color="error"
            onClick={() => onSelect(_id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}
    </ListItem>
  );
};

export default Member;
