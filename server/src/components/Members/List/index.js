import * as React from "react";
import { Typography, Paper, List } from "@mui/material";

import Member from "../Member";

const MembersList = ({
  members,
  onSelect,
  isSelect,
  isDelete,
  selectedMembers,
}) => {
  const renderMembers = () => {
    return members?.items.map((member) => {
      return (
        <Member
          key={member._id}
          member={member}
          onSelect={onSelect}
          isSelect={isSelect}
          isDelete={isDelete}
          isSelected={selectedMembers?.includes(member._id)}
        />
      );
    });
  };

  if (!members?.items?.length) {
    return (
      <Typography
        gutterBottom
        variant="h5"
        component="div"
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Please Add Members
      </Typography>
    );
  }

  return (
    <>
      {!isSelect && (
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{ p: 2, pb: 0 }}
        >
          Members
        </Typography>
      )}

      <List sx={{ mb: 2, height: "100%" }}>{renderMembers()}</List>
    </>
  );
};

export default MembersList;
