import { useState } from "react";
import styles from "./PasswordInput.module.css";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type InputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
};

const PasswordInput = ({ placeholder, value, onChange, error }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <label className={styles.inputWrapper}>
      <div className={styles.input}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
        <Button onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </Button>
      </div>
      {error && <small className={styles.error}>{error}</small>}
    </label>
  );
};

export default PasswordInput;
