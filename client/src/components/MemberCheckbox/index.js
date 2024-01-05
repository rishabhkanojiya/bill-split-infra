import React, { useEffect, useState } from "react";
import MembersList from "../Members/List";
import { Consume } from "../../context/Consumer";
import { MemberContext } from "../../context";
import { Box, Button } from "@mui/material";
import { GroupService } from "../../services/group.service";

const MemberCheckbox = ({ groupId, MemberData, members, setReFetch }) => {
  const [selectedMembers, setSelectedMembers] = useState([]);

  const handleMemberSelect = (memberId) => {
    const isMemberSelected = selectedMembers.includes(memberId);

    if (isMemberSelected) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const addMemberHandler = async () => {
    const result = selectedMembers.filter(
      (value) => !members.some((obj) => obj._id === value)
    );

    if (result?.length) {
      try {
        const resp = await GroupService.addMultipleMemberInGroup({
          groupId,
          memberIds: result,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setReFetch(true);
      }
    }
  };

  const memberProps = {
    members: {
      items: MemberData.data.items.filter(
        (value) => !members.some((obj) => obj._id === value._id)
      ),
    },
    isSelect: true,
    onSelect: handleMemberSelect,
    selectedMembers: selectedMembers,
  };

  return (
    <>
      <MembersList {...memberProps} />
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          bottom: "0",
        }}
      >
        <Button
          variant="contained"
          fullWidth={true}
          color="secondary"
          onClick={addMemberHandler}
        >
          Add
        </Button>
      </Box>
    </>
  );
};

export default Consume(MemberCheckbox, [MemberContext]);

/*
<Pagination
data={{ ...MemberData.data, items: memberProps.members.items }}
Service={(options) => MemberService.getMembers(options)}
>
{({ items }) => {
  const memberProps = { members: { items } };

  return <MembersList {...memberProps} />;
}}
</Pagination>
*/
