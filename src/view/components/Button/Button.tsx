import React from "react";
import style from "./Button.module.css";
import { NavLink, type NavLinkProps } from "react-router";

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: (e?: any) => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  theme?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "borderd";
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  onClick,
  className,
  disabled,
  theme,
  href,
  type = "button",
  ...props
}: ButtonProps) => {
  return href ? (
    <NavLink
      className={`${className} ${style.linkbtn} ${theme ? style[theme] : ""}`}
      onClick={onClick}
      {...(props as NavLinkProps)}
      to={href}
      end
    >
      {children}
    </NavLink>
  ) : (
    <button
      className={`${className} ${style.linkbtn} ${theme ? style[theme] : ""}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
      type={type}
    >
      {children}
    </button>
  );
};

export default Button;
