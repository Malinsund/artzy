import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getPosts } from "../api/posts";
import { fetchLoggedInUser } from "../api/users";
import { InnerDiv, OuterDiv, PaddingDiv } from "./LoginPage";

export const Outside = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

export const WelcomeDiv = styled.div`
  background-color: #cf9f9f;
  padding: 10px 0px;
  font-family: "Jockey One", sans-serif;
  text-align: center;
  justify-content: center;
  font-size: 25px;
`;

export const PostDiv = styled(Link)`
background-color: rgba(122, 81, 81, 0.3);
  border: solid 1px rgba(122, 81, 81, 0.3);
  display: flex;
  flex-direction: column;
  font-family: "Jockey One", sans-serif;
  text-decoration: none;
  color: black;
  margin-bottom: 15px;

  &:hover {
    background-color: rgba(122, 81, 81, 0.5);
    transition: 0.5s;
  }
`;

export const TextForPost = styled.h2`
  font-size: 25px;
  margin-bottom: 0px;
  font-weight: 600;
`;

const TextDiv = styled.div`
padding: 0px 20px;`
;

export const PriceText = styled.p`
  font-size: 16px;
  font-weight: 500;
`;

const ContentText = styled.p`
  margin-bottom: 0px;
`;

const Image = styled.img`
  height: auto;
`;

export default function Home() {
  const { isLoading, data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: fetchLoggedInUser,
  });

  return (
    <OuterDiv>
      <InnerDiv>
        <PaddingDiv>
          {isLoading && <span>Loading.....</span>}
          {user && <WelcomeDiv> Welcome back, {user.username}</WelcomeDiv>}
          {posts
            ?.slice()
            .reverse()
            .map((post) => (
              <PostDiv key={post.id} to={`/posts/${post.id}`}>
                <Image src={post.imageUrl} alt={post.title} />
                <TextDiv>
                <TextForPost>{post.title}</TextForPost>
                <ContentText>"{post.content}"</ContentText>
                <PriceText>Listed price: {post.listedPrice} €</PriceText>
                </TextDiv>
              </PostDiv>
            ))}
        </PaddingDiv>
      </InnerDiv>
    </OuterDiv>
  );
}
