"use client";

import { useState } from "react";

import Image from "next/image";

import Label from "./Label";

const ImagePreview = () => {
  const [ImagePreview, setImagePreview] = useState<string | null>();
  const [selectedImage, setSelectedImage] = useState<File | null>();

  //O usuário escolhe uma imagem no <input type="file">.
  // A imagem é lida e convertida para base64.
  // O estado ImagePreview é atualizado para armazenar essa imagem convertida.
  // O estado selectedImage guarda o arquivo original.
  // Essa string base64 pode ser usada em um <img src={ImagePreview} /> para exibir a prévia.
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setSelectedImage(file);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {ImagePreview && (
        <div className="flex justify-center mb-4">
          <Image
            src={ImagePreview}
            alt="Pré-visualização de imagem"
            className="w-[494px] h-[494px] object-cover"
            width={494}
            height={494}
            unoptimized
          />
        </div>
      )}
      <Label text="Selecione uma imagem" htmlFor="image" />
      <input
        type="file"
        id="image"
        name="image"
        accept="image/"
        onChange={handleImageChange}
        className="cursor-pointer p-2 bg-white border border-zinc-300 rounded w-full text-sm placeholder:text-zinc-500 focus:ring-0 focus:outline-none"
      />
      {selectedImage && (
        <input type="hidden" name="imageFile" value={selectedImage.name} />
      )}
    </div>
  );
};

export default ImagePreview;
