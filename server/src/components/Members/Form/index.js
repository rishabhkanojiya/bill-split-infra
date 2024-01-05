import React, { useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Container, Typography, TextField, Button } from "@mui/material";
import { styled } from "styled-components";
import { Consume } from "../../../context/Consumer";
import { LoginContext, ShowPopupContext } from "../../../context";
import { useForm } from "react-hook-form";
import { MemberService } from "../../../services/member.service";
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
    MemberService.appMember(data)
      .then((result) => {
        ShowPopupData.setPopupMessageObj(
          { message: `${data.name} Member added Successfully` },
          "success"
        );
        history.push(routesObj.members);
      })
      .catch((err) => {
        ShowPopupData.setPopupMessageObj(err.response.data, "error");
      });
  };

  return (
    <Wrapper>
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Add Members
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
            id="email"
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            {...register("email")}
          />
          <TextField
            id="mobile"
            label="Mobile Number"
            type="number"
            fullWidth
            margin="normal"
            {...register("mobile")}
          />

          <Button variant="contained" color="secondary" type="submit" fullWidth>
            Add Member
          </Button>
        </form>
      </Container>
    </Wrapper>
  );
};

export default Consume(Register, [ShowPopupContext, LoginContext]);
