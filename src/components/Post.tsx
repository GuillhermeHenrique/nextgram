"use client";

import Image from "next/image";

import { Post as PostType } from "types/Post";

//components
import LikeButton from "./Post/LikeButton";
import CommentModal from "./Post/CommentModal";

import { FiMessageSquare } from "react-icons/fi";

import { useState } from "react";

interface PostProps {
  post: PostType;
  currentUserId?: string;
}

const Post: React.FC<PostProps> = ({ post, currentUserId }) => {
  let isLiked = false;

  if (post.likes) {
    isLiked = post.likes.some((like) => like.userId === currentUserId);
  }

  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

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
        <button
          className="items-center ml-4 flex"
          onClick={() => setIsCommentModalOpen(true)}
        >
          <FiMessageSquare className="w-6 h-6 text-zinc-400" />
          <span className="ml-1">
            {post.comments ? post.comments.length : 0}
          </span>
        </button>
      </div>
      <CommentModal
        post={post}
        currentUserId={currentUserId}
        isOpen={isCommentModalOpen}
        onRequestClose={() => setIsCommentModalOpen(false)}
      />
    </div>
  );
};

export default Post;
