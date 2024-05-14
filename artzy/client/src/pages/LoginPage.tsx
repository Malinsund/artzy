import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logInUser } from "../api/users";
import { FlexColumn, FlexRow } from "../assets/Header";

export const OuterDiv = styled(FlexColumn)`
  margin-top: 20px;

  @media (min-width: 768px) {
    align-items: center;
  }
`;

export const InnerDiv = styled.div`
  font-family: "Jockey One", sans-serif;
  background-color: #cf9f9f;
  margin: 0px 10px;

  @media (min-width: 768px) {
    width: 50%;
  }
`;
export const PaddingDiv = styled.div`
  padding: 0px 30px;
`;

export const Title = styled.h2`
  font-size: 40px;
  font-weight: 400;
  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

export const SubTitle = styled.h3`
  font-weight: 300;
`;

export const LinkToSign = styled(Link)`
  cursor: pointer;
  color: black;
`;

export const FormToLogin = styled.form`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
  margin-top: 15px;
`;

export const InputLogin = styled.input`
  padding: 10px 0px 10px 5px;
  width: full;
  border-radius: 5px;
  border: none;
  font-size: 15px;

  &:focus {
    outline: 2px solid #7a5151;
  }
`;

export const ForgotPassword = styled.p`
  align-self: flex-end;
`;

export const LoginButton = styled.button`
  background: #7a5151;
  width: 100%;
  padding: 10px;
  color: white;
  margin-bottom: 30px;
  font-family: "Jockey One", sans-serif;
  font-size: 20px;
  font-weight: 200;
  cursor: pointer;
  border: solid #7a5151;
`;

export const NewMemberButton = styled(Link)`
  width: inherit;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  font-size: 20px;
  font-weight: 200;
  cursor: pointer;
  background-color: #cf9f9f;
  border: solid #7a5151;
  color: #7a5151;
  margin-bottom: 50px;
`;

export const ErrorMessage = styled.p`
  color: #7b0323;
`;

const PasswordDiv = styled(FlexRow)`
  justify-content: space-between;
`;

export default function Login() {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<{
    username: string;
    password: string;
  }>();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (formData: {
    username: string;
    password: string;
  }) => {
    try {
      await logInUser(formData);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/");
    } catch (error) {
      setErrorMessage("Incorrect username or password");
    }
  };

  return (
    <OuterDiv>
      <InnerDiv>
        <PaddingDiv>
          <Title>Login</Title>
          <SubTitle>
            Not a member yet? Sign up{" "}
            <LinkToSign to="/register">here</LinkToSign>
          </SubTitle>
          <FormToLogin onSubmit={handleSubmit(handleLogin)}>
            <Label>Username:</Label>
            <InputLogin {...register("username")} name="username"></InputLogin>
            <Label>Password:</Label>
            <InputLogin
              {...register("password")}
              name="password"
              type="password"
            ></InputLogin>
            <PasswordDiv>
              {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
              <ForgotPassword>Forgot password?</ForgotPassword>
            </PasswordDiv>
            <LoginButton type="submit">Sign in</LoginButton>
            <NewMemberButton to="/register">Become a member</NewMemberButton>
          </FormToLogin>
        </PaddingDiv>
      </InnerDiv>
    </OuterDiv>
  );
}
