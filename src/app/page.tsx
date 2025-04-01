import { getAllPosts } from "@/action";
import Post from "@/components/Post";

import { auth } from "auth";

export default async function Home() {
  const posts = await getAllPosts();

  const session = await auth();

  let userId = null;

  if (session) {
    userId = session.user.id;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 my-10">
      <h1 className="text-[2rem] leading-10 font-semibold">
        Confira os posts mais recentes
      </h1>
      <div>
        {posts && posts.length > 0 ? (
          <div className="mt-8">
            {posts.map((post) => (
              <div key={post.id}>
                <Post post={post} currentUserId={userId} />
              </div>
            ))}
          </div>
        ) : (
          <p>Ainda não há posts</p>
        )}
      </div>
    </div>
  );
}
