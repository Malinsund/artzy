import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getPosts } from "../api/posts";
import { fetchLoggedInUser } from "../api/users";
import { FlexColumn } from "../assets/Header";
import { InnerDiv, OuterDiv, PaddingDiv, SubTitle, Title } from "./LoginPage";

const ProfileBox = styled.div`
  font-family: "Jockey One", sans-serif;
  background-color: #cf9f9f;
`;

const ProfileInfo = styled(FlexColumn)`
  justify-content: center;
  font-family: "Jockey One", sans-serif;
  color: black;
`;

const PostsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 20px;
  padding-bottom: 30px;
`;

const PostDiv = styled(Link)`
  background-color: #cf9f9f;
  font-family: "Jockey One", sans-serif;
  border: solid 1px white;

  @media (max-width: 768px) {
  }
`;

const Image = styled.img`
  max-width: 315px;
  vertical-align: bottom;

  @media (max-width: 768px) {
    max-width: 400px%;
  }
`;

export default function Profile() {
  const { isLoading: isLoadingPosts, data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: fetchLoggedInUser,
  });

  if (isLoadingPosts || isLoadingUser) {
    return <div>Loading...</div>;
  }

  const userPosts = posts?.filter(
    (post) => post.author?.username === user?.username
  );

  return (
    <OuterDiv>
      <InnerDiv>
        <PaddingDiv>
        <ProfileBox>
          <ProfileInfo>
            {user && <Title>{user.username}'s profile</Title>}
            <SubTitle>Click on post to see more information 😍 </SubTitle>
          </ProfileInfo>
          <PostsContainer>
            {userPosts
              ?.slice()
              .reverse()
              .map((post) => (
                <PostDiv key={post.id} to={`/posts/${post.id}`}>
                  <Image src={post.imageUrl} alt={post.title} />
                </PostDiv>
              ))}
          </PostsContainer>
        </ProfileBox>
        </PaddingDiv>
      </InnerDiv>
    </OuterDiv>
  );
}
