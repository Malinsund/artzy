import { ArrowRightEndOnRectangleIcon, HomeIcon, PencilSquareIcon, PowerIcon, UserIcon, WrenchScrewdriverIcon } from "@heroicons/react/16/solid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchLoggedInUser, logoutUser } from "../api/users";

type CloseMenuFunction = () => void;

interface MenuProps {
  closeMenu: CloseMenuFunction;
}

export const NavItems = styled(Link)`
  color: white;
  font-weight: 300;
  text-decoration: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: flex-start;

    &:hover {
      color: #cf9f9f;
      padding-left: 15px;
      transition: 0.6s; 
    }
  }
`;

const IconWrapper = styled.span`
display: inline-block;
margin-right: 5px;
width: 20px;
color: white;

&:hover {
    color: #cf9f9f;
    transition: 0.6s;
    }
    

@media (min-width: 768px) {
    display: none;
    }`;

export default function Menu({closeMenu}: MenuProps) {
  const queryClient = useQueryClient();

  const user = useQuery({
    queryKey: ["user"],
    queryFn: fetchLoggedInUser,
  });
  
  const handleLogout = async () => {
    await logoutUser();
    queryClient.setQueryData(["user"], null);
    closeMenu();
  };


  return (
    <>
      <NavItems to="/" onClick={closeMenu}><IconWrapper><HomeIcon/></IconWrapper>Home</NavItems>
      {user.data ? (
        <>
          <NavItems to="profile" onClick={closeMenu}><IconWrapper><UserIcon/></IconWrapper>Profile</NavItems>
          <NavItems to="addPost" onClick={closeMenu}><IconWrapper><PencilSquareIcon/></IconWrapper>Create</NavItems>
          {user.data?.isAdmin && <NavItems to="/admin" onClick={closeMenu}><IconWrapper><WrenchScrewdriverIcon/></IconWrapper>Admin</NavItems>}
          <NavItems onClick={handleLogout} to="/">
          <IconWrapper><PowerIcon/></IconWrapper>Logout
          </NavItems>
        </>
      ) : (
        <NavItems to="/login" onClick={closeMenu}><IconWrapper><ArrowRightEndOnRectangleIcon/></IconWrapper>Login</NavItems>
      )}
    </>
  );
}
