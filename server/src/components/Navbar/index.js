import * as React from "react";
import { AppBar, Box, Toolbar, IconButton, Fab } from "@mui/material";
import { Menu, Add, Search, MoreVert } from "@mui/icons-material";
import Drawer from "./Drawer";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Consume } from "../../context/Consumer";
import { LoginContext, GroupContext, MemberContext } from "../../context";
import FabComp from "../FabComp";

function BottomAppBar({ GroupData, MemberData, fwdRef }) {
  let { path } = useRouteMatch();
  const history = useHistory();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let drawerProps = { open, handleClose, handleOpen };

  const renderAddButton = () => {
    const renderVal = ["/members", "/"].includes(path);
    const toPath = path == "/" ? "/groups" : "/members";

    const pulseValue =
      path == "/"
        ? GroupData?.data?.items?.length
        : MemberData?.data?.items?.length;

    let fabProps = {
      Icon: Add,
      pulseValue,
      handler: () => history.push(`${toPath}/add`),
    };

    return renderVal && <FabComp {...fabProps} />;
  };
  return (
    <React.Fragment>
      <AppBar position="fixed" color="primary" sx={{ top: "auto", bottom: 0 }}>
        <Toolbar ref={fwdRef}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleOpen}
          >
            <Menu />
          </IconButton>
          {renderAddButton()}
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit">
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer {...drawerProps} />
    </React.Fragment>
  );
}

export default Consume(BottomAppBar, [
  LoginContext,
  GroupContext,
  MemberContext,
]);
