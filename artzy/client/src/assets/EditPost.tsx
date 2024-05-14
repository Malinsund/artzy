import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Post, updatePost } from "../api/posts";
import {
  FormToLogin,
  InnerDiv,
  InputLogin,
  Label,
  OuterDiv,
  PaddingDiv,
  SubTitle,
  Title,
} from "../pages/LoginPage";
import { RegisterButton } from "../pages/RegisterPage";

export default function EditPost({
  postId,
  defaultValues,
  onSuccess,
}: {
  postId: string;
  defaultValues: Post;
  onSuccess: () => void;
}) {
  const { register, handleSubmit, setValue } = useForm<Post>({ defaultValues });

  useEffect(() => {
    setValue("title", defaultValues.title);
    setValue("content", defaultValues.content);
    setValue("listedPrice", defaultValues.listedPrice);
  }, [defaultValues, setValue]);

  const onSubmit = async ({ ...data }: Post) => {
    try {
      data.listedPrice = Number(data.listedPrice);
      console.log("data", data);
      const updatedPost = { ...data };
      console.log("Updated post:", updatedPost);

      await updatePost(postId, updatedPost);

      window.location.reload();

      onSuccess();
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <OuterDiv>
      <InnerDiv>
        <PaddingDiv>
          <Title>Edit post</Title>
          <SubTitle>Update the details of your artsy craft.</SubTitle>{" "}
          <FormToLogin onSubmit={handleSubmit(onSubmit)}>
            <Label>Title:</Label>
            <InputLogin
              id="title"
              {...register("title", { required: true })}
            ></InputLogin>
            <Label>Content:</Label>
            <InputLogin
              id="content"
              {...register("content", { required: true })}
            ></InputLogin>
            <Label>Price:</Label>
            <InputLogin
              id="listedPrice"
              {...register("listedPrice")}
              type="number"
            ></InputLogin>
            <RegisterButton type="submit">Update post</RegisterButton>{" "}
          </FormToLogin>
        </PaddingDiv>
      </InnerDiv>
    </OuterDiv>
  );
}
