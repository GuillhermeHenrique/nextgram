"use client";

import Image from "next/image";

import { Post as PostType } from "types/Post";

import LikeButton from "./Post/LikeButton";

interface PostProps {
  post: PostType;
  currentUserId?: string;
}

const Post: React.FC<PostProps> = ({ post, currentUserId }) => {
  let isLiked = false;

  if (post.likes) {
    isLiked = post.likes.some((like) => like.userId === currentUserId);
  }

  return (
    <div className="bg-white w-fit mx-auto mb-6 p-4 rounded-lg shadow-sm">
      <div className="flex items-center">
        {post.user.image && (
          <Image
            src={post.user.image}
            alt={post.user.name || "Imagem do usuário"}
            className="w-10 h-10 object-cover rounded-full mb-4"
            width={40}
            height={40}
          />
        )}
        <p className="text-sm font-medium mb-3 ml-3">{post.user.name}</p>
      </div>
      <Image
        src={post.imageUrl}
        alt={post.caption || "Imagem sem legenda"}
        className="w-[670px] h-[400px] object-cover mb-4 rounded"
        width={670}
        height={400}
      />
      {post.caption && (
        <p className="mb-4 text-sm font-medium">{post.caption}</p>
      )}
      <div className="flex items-center mt-4">
        <LikeButton
          postId={post.id}
          initialLikesCount={post.likes?.length ? post.likes.length : 0}
          isLiked={isLiked}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
};

export default Post;
