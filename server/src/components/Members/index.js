import React, { useEffect, useState } from "react";
import { MemberContext } from "../../context";
import { Consume } from "../../context/Consumer";
import Loader from "../Loader";
import MembersList from "./List";
import Pagination from "../Pagination";
import { MemberService } from "../../services/member.service";

const Members = ({ MemberData }) => {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMembers(MemberData.data);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Pagination
      data={MemberData.data}
      Service={(options) => MemberService.getMembers(options)}
    >
      {({ items }) => {
        const memberProps = { members: { items } };

        return <MembersList {...memberProps} />;
      }}
    </Pagination>
  );
};

export default Consume(Members, [MemberContext]);
