import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button"> & {
  text: string;
  danger?: boolean;
};

const Button: React.FC<ButtonProps> = ({ text, danger = false, ...props }) => {
  return (
    <button
      data-danger={danger}
      className="cursor-pointer h-8 text-sm font-medium text-white py-1 px-6 rounded flex items-center hover:bg-zinc-200 data-[danger=true]:bg-red-700 data-[danger=true]:hover:bg-red-800 transition duration-500"
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
