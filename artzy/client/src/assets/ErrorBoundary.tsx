import React, { Component, ErrorInfo } from "react";
import styled from "styled-components";
import { FlexColumn } from "./Header";

const ErrorDiv = styled(FlexColumn)`
  background-image: url("../img/skriet.jpeg");
  background-size: cover;
  justify-content: center;
  align-items: center;
  font-family: "Jockey One", sans-serif;
`;
const LinkToHome = styled.a`
  color: #332f2f;
  text-decoration-skip-ink: auto;
`;

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error: ", error, errorInfo);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDiv role="alert">
          <h1>Sorry, something went wrong</h1>
          <h2>
            Go back to {""} <LinkToHome href="/">Home</LinkToHome> and try again
            🖌️
          </h2>
        </ErrorDiv>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
