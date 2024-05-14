import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { uploadImage } from "../api/images";
import { addNewPost } from "../api/posts";
import {
  FormToLogin,
  InnerDiv,
  InputLogin,
  Label,
  OuterDiv,
  PaddingDiv,
  SubTitle,
  Title,
} from "./LoginPage";
import { RegisterButton } from "./RegisterPage";

export default function AddPost() {
  const [successMessage, setSuccessMessage] = useState("");
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async ({ image, ...data }) => {
    try {
      const imageData = new FormData();
      imageData.append("image", image[0]);

      const imageResponse = await uploadImage(imageData);
      const imageId = await imageResponse.json();

      const post = { ...data, image: imageId };

      const postResponse = await addNewPost(post);

      if (postResponse.ok) {
        setSuccessMessage("Post added successfully!");
      } else {
        throw new Error(`Failed to add new post (${postResponse.status})`);
      }
    } catch (error) {
      console.error("Error adding post:", error);
    }
    navigate("/");
  };

  return (
    <OuterDiv>
      <InnerDiv>
        <PaddingDiv>
          <Title>Create new post</Title>
          <SubTitle>Upload a image of your artwork and describe it.</SubTitle>

          <FormToLogin onSubmit={handleSubmit(onSubmit)}>
            <Label>Title:</Label>
            <InputLogin
              id="title"
              {...register("title", { required: true })}
              name="title"
            ></InputLogin>
            <Label>Content:</Label>
            <InputLogin
              id="content"
              {...register("content", { required: true })}
              name="content"
            ></InputLogin>
            <Label>Price:</Label>
            <InputLogin
              id="listedPrice"
              {...register("listedPrice")}
              name="listedPrice"
            ></InputLogin>
            <Label>Image:</Label>
            <InputLogin
              id="image"
              {...register("image")}
              type="file"
              name="image"
            ></InputLogin>

            <RegisterButton type="submit">Add post</RegisterButton>
          </FormToLogin>
        </PaddingDiv>
      </InnerDiv>
    </OuterDiv>
  );
}
