import React, { useEffect, useState } from "react";
import { GroupContext } from "../../context";
import { Consume } from "../../context/Consumer";
import { GroupService } from "../../services/group.service";
import Loader from "../Loader";
import GroupList from "./List";
import Pagination from "../Pagination";

const Groups = ({ GroupData }) => {
  return (
    <Pagination
      data={GroupData.data}
      Service={(options) => GroupService.getGroups(options)}
    >
      {({ items }) => {
        const groupProps = { groups: { items } };

        return <GroupList {...groupProps} />;
      }}
    </Pagination>
  );
};

export default Consume(Groups, [GroupContext]);
