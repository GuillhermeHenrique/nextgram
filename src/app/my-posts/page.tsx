import { deletePost, getUserPosts } from "@/action";

import { auth } from "auth";

import Image from "next/image";

import { redirect } from "next/navigation";

//Components
import Button from "@/components/Button";
import ButtonLink from "@/components/ButtonLink";

const MyPostsPage = async () => {
  const session = await auth();

  let userId = null;

  if (session) {
    userId = session.user.userId;
  } else {
    redirect("/");
  }

  const posts = await getUserPosts(userId);

  return (
    <div className=" mx-auto my-10 p-4">
      <h1 className="text-[2rem] leading-10 font-semibold text-center mb-8">
        Minhas postagens
      </h1>
      {posts.length === 0 ? (
        <div className="p-5 bg-white text-center w-[400px] mx-auto rounded">
          <p className="mb-4 font-medium">Você ainda não tem postagens</p>
          <div className="flex justify-center">
            <ButtonLink text="Criar nova postagem" url="/post/new" />
          </div>
        </div>
      ) : (
        <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border rounded p-4 shadow-sm">
              <Image
                src={post.imageUrl}
                alt={post.caption || "Imagem do post"}
                className="w-[366px] h-[218px] object-cover mb-4 rounded"
                width={366}
                height={218}
              />
              {post.caption && (
                <p className="mb-2 text-sm font-medium">{post.caption}</p>
              )}
              <form action={deletePost}>
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="postId" value={post.id} />
                <div className="flex justify-end">
                  <Button text="Excluir" type="submit" danger={true} />
                </div>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPostsPage;
