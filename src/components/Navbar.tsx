import { auth, signIn, signOut } from "auth";

import { getUserByEmail } from "@/action";

import Link from "next/link";

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
            <p>{user.name}</p>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">
                Sair
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/signin"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          >
            Entrar
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
