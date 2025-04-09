"use client";

import { useState } from "react";

import Modal from "react-modal";

import { Post as PostType } from "types/Post";

import FlashMessage from "../FlashMessage";

import Button from "../Button";

import { addComment } from "@/action";

import { GrClose } from "react-icons/gr";
import Image from "next/image";

interface CommentModalProps {
  post: PostType;
  currentUserId?: string;
  isOpen: boolean;
  onRequestClose: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  post,
  currentUserId,
  isOpen,
  onRequestClose,
}) => {
  const [content, setContent] = useState("");

  const [flashMessage, setFlashMessage] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);

  const handleAddComment = async () => {
    if (!currentUserId) {
      window.location.href = "/signin";
      return;
    }

    // Validação
    if (!content.trim()) {
      // Disparar flash message
      setFlashMessage({
        message: "O comentário está vazio",
        type: "error",
      });

      return;
    }

    // Utilização do action
    await addComment(post.id, currentUserId, content);

    // Feedback visual de sucesso
    setFlashMessage({
      message: "Comentário enviado com sucesso",
      type: "success",
    });

    setContent("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={"Comentários"}
      ariaHideApp={false}
      className="w-[704px] mt-15 mx-auto bg-white rounded border border-zinc-300"
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold mb-4">Comentários</h2>
          <button
            onClick={onRequestClose}
            className="bg-red-600 hover:bg-red-700 text-white rounded p-1"
          >
            <GrClose />
          </button>
        </div>
        {flashMessage && (
          <FlashMessage
            message={flashMessage.message}
            type={flashMessage.type}
          />
        )}
        <div className="mb-4 flex flex-col">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div className="flex items-center mb-4" key={comment.id}>
                {comment.user.image && (
                  <Image
                    src={comment.user.image}
                    alt={`Imagem do usuário: ${comment.user.name}`}
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 object-cover mr-3"
                  />
                )}
                <p className="text-sm">
                  <strong>{comment.user.name}</strong> {comment.content}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">Não há comentários nesse post</p>
          )}
        </div>
        {currentUserId && (
          <div className="mb-4 flex flex-col gap-6">
            <textarea
              className="w-full border h-32 p-2 border-zinc-300 rounded text-sm font-medium"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Adicione um comentário"
            ></textarea>
            <div className="flex justify-end">
              <Button
                type="button"
                text="Comentar"
                onClick={handleAddComment}
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CommentModal;
