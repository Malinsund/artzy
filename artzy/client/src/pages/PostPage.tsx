import { PencilSquareIcon, TrashIcon } from "@heroicons/react/16/solid";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { getPostById } from "../api/posts";
import { fetchLoggedInUser } from "../api/users";
import EditPost from "../assets/EditPost";
import { FlexColumn, FlexRow } from "../assets/Header";
import { PriceText } from "./HomePage";
import { InnerDiv, OuterDiv, PaddingDiv } from "./LoginPage";

const BigEditIcon = styled(PencilSquareIcon)`
  height: 25px;
  color: #7a5151;
  cursor: pointer;
`;

const DivForPost = styled(FlexColumn)`
  background-color: #cf9f9f;
  font-family: "Jockey One", sans-serif;
`;

const Image = styled.img`
  margin: 25px 0px 0px 0px;
  max-width: 100%;
`;

const TextDiv = styled(FlexColumn)`
  @media (min-width: 768px) {
    justify-content: space-evenly;
  }
`;

const InformationDiv = styled(FlexColumn)`
  justify-content: space-between;
`;

const Title = styled.h1`
  margin-bottom: 5px;
  font-size: 28px;
`;

const ArtistText = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-top: 0px;
`;

const TitleDiv = styled.div``;

const ContentDiv = styled.div`
  font-size: 16px;
  font-weight: 500;
  margin-top: 5px;

  @media (min-width: 768px) {
    margin-top: 30px;
  }
`;

const Line = styled(FlexRow)`
  align-items: center;
  justify-content: center;
  height: 1px;
  background-color: #7a5151;
  margin-top: 30px;

  width: 50%;
`;

const IconsDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TitleDivAndDelete = styled(FlexRow)`
  justify-content: space-between;
`;

export const DeleteIcon = styled(TrashIcon)`
  height: 25px;
  color: #7a5151;
  cursor: pointer;
  margin-right: 10px;
`;

export default function PostPage() {
  const params = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: fetchLoggedInUser,
  });

  const { data: post } = useQuery({
    queryKey: ["post", params.id ?? ""],
    queryFn: () => getPostById(params.id ?? ""),
  });

  if (!post) {
    return (
      <div>
        <h1>This post does not exist.</h1>
      </div>
    );
  }

  const handleDelete = async () => {
    await fetch(`/api/posts/${post.id}`, {
      method: "DELETE",
    });
    navigate("/");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdateSuccess = async () => {
    setIsEditing(false);
  };

  const capitalizedAuthor =
    post?.authorname.charAt(0).toUpperCase() + post?.authorname.slice(1);

  return (
    <OuterDiv>
      <InnerDiv>
        <PaddingDiv>
          {!isEditing && (
            <DivForPost>
              <Image src={post.imageUrl} alt={post.title} />

              <TextDiv>
                <InformationDiv>
                  <FlexColumn>
                    <TitleDivAndDelete>
                      <TitleDiv>
                        <Title>{post.title}</Title>
                        <ArtistText>Made by: {capitalizedAuthor}</ArtistText>
                      </TitleDiv>
                      {(userData?.username === post.authorname ||
                        userData?.isAdmin) && (
                        <IconsDiv>
                          <DeleteIcon onClick={handleDelete}>Delete</DeleteIcon>
                          <BigEditIcon onClick={handleEdit}>Edit</BigEditIcon>
                        </IconsDiv>
                      )}
                    </TitleDivAndDelete>
                  </FlexColumn>
                  <ContentDiv>"{post.content}"</ContentDiv>
                </InformationDiv>
                <FlexColumn>
                  <Line />
                  <PriceText>Listed price: {post.listedPrice} €</PriceText>
                </FlexColumn>
              </TextDiv>
            </DivForPost>
          )}
          {isEditing && (
            <EditPost
              postId={post.id}
              defaultValues={post}
              onSuccess={
                handleUpdateSuccess
              }
            />
          )}
        </PaddingDiv>
      </InnerDiv>
    </OuterDiv>
  );
}
