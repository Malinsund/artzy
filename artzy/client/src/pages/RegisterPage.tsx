import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { registerUser } from "../api/users";
import {
  ErrorMessage,
  FormToLogin,
  InnerDiv,
  InputLogin,
  Label,
  OuterDiv,
  PaddingDiv,
  SubTitle,
  Title,
} from "./LoginPage";

export const RegisterButton = styled.button`
  background: #7a5151;
  width: 100%;
  padding: 10px;
  color: white;
  margin: 30px 0;
  font-family: "Jockey One", sans-serif;
  font-size: 20px;
  font-weight: 200;
  cursor: pointer;
  border: solid #7a5151;
`;

const SuccessText = styled.p`
  background-color: #7a5151;
  color: white;
`;

interface FormData {
  username: string;
  password: string;
}

export default function RegisterUser() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister: SubmitHandler<FormData> = async (data) => {
    const { username, password } = data;

    try {
      await registerUser({ username, password });
      setSuccessMessage(`Welcome to Artsy, ${username}!`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <OuterDiv>
      <InnerDiv>
        <PaddingDiv>
          <Title>Register</Title>
          <SubTitle>Choose an Artsy username and password. 🎨</SubTitle>
          <FormToLogin onSubmit={handleSubmit(handleRegister)}>
            <Label>Username:</Label>
            <InputLogin
              id="username"
              {...register("username", { required: true })}
              name="username"
            ></InputLogin>
            {errors.username && (
              <ErrorMessage>This field is required</ErrorMessage>
            )}
            <Label>Password:</Label>
            <InputLogin
              id="password"
              {...register("password", { required: true })}
              type="password"
              name="password"
            ></InputLogin>
            {errors.password && (
              <ErrorMessage>This field is required</ErrorMessage>
            )}
            <RegisterButton type="submit">Register</RegisterButton>
            {successMessage && <SuccessText>{successMessage}</SuccessText>}
          </FormToLogin>
        </PaddingDiv>
      </InnerDiv>
    </OuterDiv>
  );
}
