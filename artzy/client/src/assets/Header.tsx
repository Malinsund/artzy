import { useState } from "react";
import styled, { keyframes } from "styled-components";
import Menu from "./Menu";

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const slideInAnimation = keyframes`
    from {
      left: -100%;
      }
      to {
        left: 0;
        }`;

  const slideOutAnimation = keyframes`
    from {
      left: 0;
      }
      to {
        left: -100%;
        }`;

  const OuterDiv = styled(FlexColumn)`
    font-family: "Lexend Mega", sans-serif;
    position: sticky;
    top: 0;
    background-color: #a87676;
    z-index: 1000;
  `;

  const Line = styled(FlexRow)`
    align-items: center;
    justify-content: center;
    height: 1px;
    background-color: white;
    width: 50%;
    margin: 0 auto;

    @media (max-width: 768px) {
      margin-bottom: 15px;
    }
  `;

  const Title = styled.h1`
    font-size: 40px;
    color: white;
    text-align: center;
    font-weight: 400;
  `;

  const NavBar = styled.nav`
    display: flex;
    justify-content: center;
    gap: 20px;
    margin: 15px 0px;

    @media (max-width: 768px) {
      display: none;
    }
  `;

  const SideMenu = styled.div`
    display: flex;
    position: fixed;
    top: 0;
    left: ${showMenu ? "0" : "100%"};
    width: 60%;
    height: 100vh;
    background-color: #7a5151;
    z-index: 1000;
    animation: ${showMenu ? slideInAnimation : slideOutAnimation} 1.5s forwards;

    @media (min-width: 768px) {
      display: none;
    }
  `;

  const SideMenuContent = styled(FlexColumn)`
    justify-content: center;
    gap: 25px;
    flex-grow: 1;
    padding: 30%;
  `;

  const HamburgerMenu = styled.div`
    color: white;
    font-size: 24px;
    cursor: pointer;
    position: fixed;
    top: 45px;
    left: 20px;
    z-index: 1100;
    display: block;

    @media (min-width: 768px) {
      display: none;
    }
  `;

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <OuterDiv>
      <Title>Artsy</Title>
      <Line />
      <SideMenu>
        <SideMenuContent>
          <Menu closeMenu={closeMenu} />
        </SideMenuContent>
      </SideMenu>
      <NavBar>
        <Menu closeMenu={closeMenu} />
      </NavBar>
      <HamburgerMenu onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? <>&#10005;</> : <> &#9776;</>}
      </HamburgerMenu>
    </OuterDiv>
  );
}
