import * as React from "react";

import {
  CardActionArea,
  CardActions,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Collapse,
} from "@mui/material";
import { AvTimer, Delete, Share } from "@mui/icons-material";
import { Consume } from "../../../context/Consumer";
import { GroupContext } from "../../../context";
import { useHistory } from "react-router-dom";
import { routesObj } from "../../../common/constants";
import useLongPress from "../../../hooks/useLongPress";
import { GroupService } from "../../../services/group.service";

const Group = ({ group, GroupData }) => {
  const history = useHistory();
  const { name, subject, image, totalAmount, reminder, _id } = group;
  const [showOptions, setShowOptions] = React.useState(false);

  React.useEffect(() => {
    showOptions &&
      setTimeout(() => {
        setShowOptions(false);
      }, 5000);
  }, [showOptions]);

  const deleteGroup = async () => {
    try {
      await GroupService.deleteGroup({
        groupId: _id,
      });
      const groupsRes = await GroupService.getGroups();
      GroupData.setGroups(groupsRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onLongPress = () => {
    setShowOptions((prevOptions) => !prevOptions);
  };

  const onClick = () => {
    GroupData.setGroup(group);
    history.push(routesObj.groupId.replace(":groupId", _id));
  };

  const longPressEvent = useLongPress(onLongPress, onClick, {
    shouldPreventDefault: true,
    delay: 500,
  });

  return (
    <Card sx={{ maxWidth: "100%", m: 2 }}>
      <CardActionArea {...longPressEvent}>
        <CardMedia
          style={{
            height: showOptions ? "350px" : "140px",
            transition: "height 0.5s ease-out",
          }}
          component="img"
          image={image}
          alt={name}
        />

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subject}
          </Typography>
        </CardContent>
      </CardActionArea>

      <Collapse in={showOptions}>
        <CardActions
          disableSpacing
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div>
            <IconButton
              aria-label="share"
              color={reminder ? "success" : "error"}
            >
              <AvTimer />
            </IconButton>
          </div>
          <div>
            <IconButton aria-label="share" color="error" onClick={deleteGroup}>
              <Delete />
            </IconButton>
          </div>
        </CardActions>
      </Collapse>
    </Card>
  );
};

export default Consume(Group, [GroupContext]);
