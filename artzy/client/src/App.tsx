import { Outlet } from "react-router";
import styled from "styled-components";
import ErrorBoundary from "./assets/ErrorBoundary";
import Header from "./assets/Header";

const Main = styled.main`
  margin: auto;
`;

function App() {
  return (
      <>
        <Header />
        <ErrorBoundary>
          <Main>
            <Outlet />
          </Main>
        </ErrorBoundary>
      </>
  );
}

export default App;
