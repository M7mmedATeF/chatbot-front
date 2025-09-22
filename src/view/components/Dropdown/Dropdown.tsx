import React, { useMemo, useState, useRef, useEffect } from "react";
import styles from "./Dropdown.module.css";
import Button from "../Button/Button";

export type DropdownOptionObj = {
  label: string;
  value: string;
  icon?: string;
  image?: string;
};

export type DropdownOption = DropdownOptionObj | string | number;

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  options?: DropdownOption[];
};

const Dropdown = ({
  placeholder,
  value,
  onChange,
  label,
  error,
  options,
  ...props
}: InputProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"top" | "bottom">("bottom");
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const optionsList: DropdownOptionObj[] = useMemo(() => {
    return (
      options && options.length > 0
        ? options?.map((option) =>
            typeof option === "string" || typeof option === "number"
              ? {
                  label: option,
                  value: option,
                }
              : option
          )
        : []
    ) as DropdownOptionObj[];
  }, [options]);

  const filteredOptions = useMemo(() => {
    return isSearch
      ? optionsList.filter((option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase())
        )
      : optionsList;
  }, [optionsList, searchValue, isSearch]);

  // Calculate optimal dropdown position
  useEffect(() => {
    if (!isOpen || !inputWrapperRef.current || !dropdownRef.current) return;

    const calculatePosition = () => {
      const inputWrapper = inputWrapperRef.current!;
      const dropdown = dropdownRef.current!;

      const inputRect = inputWrapper.getBoundingClientRect();
      const dropdownRect = dropdown.getBoundingClientRect();
      const dropdownHeight =
        dropdownRect.height || dropdown.offsetHeight || 200; // fallback height
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate available space with viewport boundaries
      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;
      const spaceLeft = inputRect.left;
      const spaceRight = viewportWidth - inputRect.right;

      // Minimum required space with buffer
      const minVerticalSpace = dropdownHeight + 20; // 20px buffer
      const minHorizontalSpace = 10; // 10px buffer for horizontal

      // Determine best vertical position
      let bestPosition: "top" | "bottom" = "bottom";

      if (spaceBelow >= minVerticalSpace) {
        bestPosition = "bottom";
      } else if (spaceAbove >= minVerticalSpace) {
        bestPosition = "top";
      } else {
        // If neither has enough space, choose the one with more space
        bestPosition = spaceBelow > spaceAbove ? "bottom" : "top";
      }

      // Handle horizontal overflow by adjusting dropdown width if needed
      const dropdownWidth = dropdownRect.width || inputRect.width;
      if (
        spaceLeft + dropdownWidth > viewportWidth &&
        spaceRight < minHorizontalSpace
      ) {
        // Dropdown would overflow right edge, try to fit it
        dropdown.style.maxWidth = `${Math.min(
          dropdownWidth,
          viewportWidth - spaceLeft - 20
        )}px`;
        dropdown.style.left = "0";
        dropdown.style.right = "auto";
      } else if (
        spaceRight + dropdownWidth > viewportWidth &&
        spaceLeft < minHorizontalSpace
      ) {
        // Dropdown would overflow left edge
        dropdown.style.maxWidth = `${Math.min(
          dropdownWidth,
          viewportWidth - spaceRight - 20
        )}px`;
        dropdown.style.right = "0";
        dropdown.style.left = "auto";
      } else {
        // Reset to default
        dropdown.style.maxWidth = "";
        dropdown.style.left = "";
        dropdown.style.right = "";
      }

      setPosition(bestPosition);
    };

    // Calculate position immediately
    calculatePosition();

    // Recalculate on window resize and scroll
    window.addEventListener("resize", calculatePosition);
    window.addEventListener("scroll", calculatePosition);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition);
    };
  }, [isOpen]);

  // Handle input focus/blur to control dropdown visibility
  const handleInputFocus = () => {
    if (optionsList.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Use setTimeout to allow click events on dropdown items to fire first
    setTimeout(() => {
      setIsOpen(false);
      setIsSearch(false);
    }, 300);
  };

  // Cleanup dropdown styles when closing
  useEffect(() => {
    if (!isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      dropdown.style.maxWidth = "";
      dropdown.style.left = "";
      dropdown.style.right = "";
    }
  }, [isOpen]);

  const handleOptionClick = (option: DropdownOptionObj) => {
    onChange?.(String(option.value));
    setIsOpen(false);
    setIsSearch(false);
    setSearchValue("");
  };

  const showValue = useMemo(() => {
    return optionsList.find((option) => option.value === value)?.label || "";
  }, [optionsList, value]);

  return (
    <div className={styles.inputWrapper} ref={inputWrapperRef}>
      <label className={styles.input}>
        {label && <span className={styles.label}>{label}</span>}
        <input
          type="text"
          placeholder={placeholder}
          value={isSearch ? searchValue : showValue}
          {...props}
          onChange={(e) => {
            setIsSearch(true);
            setSearchValue(e.target.value);
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </label>
      <ul
        ref={dropdownRef}
        className={`${styles.dropdownList} ${styles[position]} ${
          isOpen ? styles.open : ""
        }`}
      >
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option: DropdownOptionObj) => (
            <li key={option.value}>
              <Button
                onClick={() => handleOptionClick(option)}
                className={value == option.value ? styles.active : ""}
              >
                {option.label}
              </Button>
            </li>
          ))
        ) : (
          <li>No options</li>
        )}
      </ul>
      {error && <small className={styles.error}>{error}</small>}
    </div>
  );
};

export default Dropdown;
