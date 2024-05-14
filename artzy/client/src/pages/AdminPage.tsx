import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";
import { fetchAllUsers, fetchLoggedInUser, updateUser } from "../api/users";
import { PostDiv, PriceText, WelcomeDiv } from "./HomePage";
import { InnerDiv, OuterDiv, PaddingDiv } from "./LoginPage";
import { DeleteIcon } from "./PostPage";

export const EditIcon = styled(PencilSquareIcon)`
  width: 21px;
  color: #7a5151;
  cursor: pointer;
  margin-right: 10px;
  padding-left: 4px;
`;

const DeleteIconSmaller = styled(DeleteIcon)`
  width: 21px;
`;

const InformationText = styled(PriceText)`
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 10px;
  margin-top: 5px;
  width: 100%;
`;

const WelcomeTitle = styled.h1`
  font-size: 22px;
  font-weight: 500;
`;

const WelcomeText = styled.p`
  font-weight: 300;
  font-size: 18px;
`;

const InformationDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const SymbolsDiv = styled.div`
  display: flex;
  padding: 0 10px 10px 10px;
`;

const Bold = styled.span`
  font-weight: 600;
`;

export default function Admin() {
  const navigate = useNavigate();
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);

  const { isLoading, data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchLoggedInUser,
  });

  if (!users) {
    return <h1>No users are registred! 😭</h1>;
  }

  const handleDelete = async (userId: string) => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      navigate("/admin");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleChangeRole = async (userId: string, isAdmin: boolean) => {
    try {
      setIsUpdateLoading(true);
      await updateUser(userId, !isAdmin);
      navigate("/admin");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsUpdateLoading(false);
    }
  };

  const capitalizedAdmin =
    user.username.charAt(0).toUpperCase() + user.username.slice(1);

  return (
    <OuterDiv>
      <InnerDiv>
        <PaddingDiv>
          {isLoading && <span>Loading.....</span>}
          <WelcomeDiv>
            <WelcomeTitle>
              Welcome, {capitalizedAdmin}! You've arrived at your admin
              dashboard.
            </WelcomeTitle>
            <WelcomeText>
              Below, you'll find a list of all our registered users. Feel free
              to remove any troublemakers and adjust access levels as needed.
            </WelcomeText>
          </WelcomeDiv>
          {users &&
            users.map((user) => (
              <PostDiv key={user._id} to={`/users/${user._id}`}>
                <InformationDiv>
                  <div>
                    <InformationText>
                      Username: <Bold>{user.username}</Bold>
                    </InformationText>
                  </div>
                  <div>
                    <InformationText>
                      Access Level:{" "}
                      <Bold>{user.isAdmin ? "Admin" : "Member"}</Bold>
                    </InformationText>
                  </div>
                </InformationDiv>
                <SymbolsDiv>
                  Edit access:
                  <EditIcon
                    onClick={() => handleChangeRole(user._id, user.isAdmin)}
                  >
                    Change role
                  </EditIcon>
                </SymbolsDiv>
                <SymbolsDiv>
                  Delete user:
                  <DeleteIconSmaller onClick={() => handleDelete(user._id)}>
                    Delete
                  </DeleteIconSmaller>
                </SymbolsDiv>
              </PostDiv>
            ))}
        </PaddingDiv>
      </InnerDiv>
    </OuterDiv>
  );
}
