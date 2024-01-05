import { Typography } from "@mui/material";
import React from "react";
import Group from "../Group";

const GroupList = ({ groups }) => {
  const renderGroups = () => {
    return groups.items.map((group) => {
      return <Group group={group} />;
    });
  };
  if (!groups?.items?.length) {
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
        Please Create A Group
      </Typography>
    );
  }

  return <>{renderGroups()}</>;
};

export default GroupList;
