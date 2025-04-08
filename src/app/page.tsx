import { getAllPosts } from "@/action";

import Post from "@/components/Post";

import { auth } from "auth";

export default async function Home() {
  const posts = await getAllPosts();

  const session = await auth();

  let userId = null;

  if (session) {
    userId = session.user.userId;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 mb-4">
      <div>
        {posts && posts.length > 0 ? (
          <div className="mt-[0.5px]">
            {posts.map((post) => (
              <Post post={post} currentUserId={userId} key={post.id} />
            ))}
          </div>
        ) : (
          <p>Ainda não há posts</p>
        )}
      </div>
    </div>
  );
}
