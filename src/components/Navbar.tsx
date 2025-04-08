import { auth, signOut } from "auth";

import { getUserByEmail } from "@/action";

import Link from "next/link";

import Image from "next/image";

//Components
import Button from "./Button";
import ButtonLink from "./ButtonLink";

const Navbar = async () => {
  const session = await auth();

  const user = await getUserByEmail(session?.user.email);

  return (
    <div className="bg-gray-100 px-10 py-5 flex justify-between items-center shadow-[0_5px_5px_rgba(0,0,0,0.2)]">
      <Link href="/" className=" text-lg font-bold">
        Nextgram
      </Link>
      <div>
        {user ? (
          // Logado
          <div className="flex gap-4 items-center">
            <p className="font-medium">{user.name}</p>
            {user.image && (
              <Image
                src={user.image}
                alt={`Perfil de: ${user.name}`}
                className="w-10 h-10 rounded-full object-cover"
                width={40}
                height={40}
              />
            )}
            <Link
              href={"/profile"}
              className="font-medium hover:text-gray-900 transition duration-300"
            >
              Perfil
            </Link>
            <Link
              href={"/post/new"}
              className="font-medium hover:text-gray-900 transition duration-300"
            >
              Criar postagem
            </Link>
            <Link
              href={"/my-posts"}
              className="font-medium hover:text-gray-900 transition duration-300"
            >
              Minhas postagens
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button text="Sair" danger={true} type="submit" />
            </form>
          </div>
        ) : (
          <ButtonLink text="Entrar" url="/signin" />
        )}
      </div>
    </div>
  );
};

export default Navbar;
