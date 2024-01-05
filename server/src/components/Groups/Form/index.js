import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Typography, TextField, Button } from "@mui/material";
import { styled } from "styled-components";
import { Consume } from "../../../context/Consumer";
import { LoginContext, ShowPopupContext } from "../../../context";
import { useForm } from "react-hook-form";
import { GroupService } from "../../../services/group.service";
import { routesObj } from "../../../common/constants";

const Wrapper = styled.div`
  height: 100%;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #ce93d8;
`;

const Register = ({ ShowPopupData, LoginData }) => {
  const history = useHistory();

  const { register, handleSubmit } = useForm({ mode: "onSubmit" });

  const onSubmit = (data) => {
    GroupService.appGroup(data)
      .then((result) => {
        ShowPopupData.setPopupMessageObj(
          { message: `${data.name} Group Created Successfully` },
          "success"
        );
        history.push(routesObj.home);
      })
      .catch((err) => {
        ShowPopupData.setPopupMessageObj(err.response.data, "error");
      });
  };

  return (
    <Wrapper>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Create Group
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            id="name"
            label="Name"
            fullWidth
            margin="normal"
            required
            {...register("name")}
          />
          <TextField
            id="subject"
            label="Subject"
            fullWidth
            margin="normal"
            required
            {...register("subject")}
          />
          <TextField
            id="image"
            label="Image Link"
            fullWidth
            margin="normal"
            required
            {...register("image")}
          />
          <TextField
            id="totalAmount"
            label="Total Amount"
            fullWidth
            margin="normal"
            required
            {...register("totalAmount")}
          />

          <Button variant="contained" color="secondary" type="submit" fullWidth>
            Create Group
          </Button>
        </form>
      </Container>
    </Wrapper>
  );
};

export default Consume(Register, [ShowPopupContext, LoginContext]);
