import Link from "next/link";

type ButtonProps = {
  text: string;
  url: string;
};

const ButtonLink: React.FC<ButtonProps> = ({ text, url }) => {
  return (
    <Link
      href={url}
      className="bg-gray-950 cursor-pointer w-fit h-8 hover:bg-gray-900 transition duration-500 text-sm font-medium text-white py-1 px-6 rounded flex items-center"
    >
      {text}
    </Link>
  );
};

export default ButtonLink;
