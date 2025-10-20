import { useState, useRef, useEffect, useMemo } from "react";
import style from "./MultiSelectDropdown.module.css";
import { FaChevronDown, FaTimes, FaCheck } from "react-icons/fa";
import Image from "../Image/Image";
import type { MCPItem } from "../../../services/Queries/MCPs.gql";
import Button from "../Button/Button";

interface MultiSelectDropdownProps {
  label?: string;
  placeholder?: string;
  options: MCPItem[];
  selectedIds: number[];
  onChange: (selectedIds: number[]) => void;
  error?: string;
  disabled?: boolean;
}

const MultiSelectDropdown = ({
  label,
  placeholder = "Select MCPs...",
  options,
  selectedIds,
  onChange,
  error,
  disabled = false,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;

    const searchLower = searchTerm.toLowerCase();
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(searchLower) ||
        option.description.toLowerCase().includes(searchLower) ||
        option.Tools.some((tool) =>
          tool.name.toLowerCase().includes(searchLower)
        )
    );
  }, [options, searchTerm]);

  // Get selected options
  const selectedOptions = useMemo(() => {
    return options.filter((option) => selectedIds.includes(option.id));
  }, [options, selectedIds]);

  // Handle toggle dropdown
  const toggleDropdown = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    setSearchTerm("");
  };

  // Handle option toggle
  const toggleOption = (optionId: number) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter((id) => id !== optionId));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };

  // Remove selected option
  const removeOption = (optionId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((id) => id !== optionId));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className={style.multiSelectContainer} ref={dropdownRef}>
      {label && <label className={style.label}>{label}</label>}

      <div
        className={`${style.selectBox} ${isOpen ? style.open : ""} ${
          error ? style.hasError : ""
        } ${disabled ? style.disabled : ""}`}
        onClick={toggleDropdown}
      >
        <div className={style.selectedItems}>
          {selectedOptions.length === 0 ? (
            <span className={style.placeholder}>{placeholder}</span>
          ) : (
            <div className={style.selectedList}>
              {selectedOptions.map((option) => (
                <div key={option.id} className={style.selectedTag}>
                  <Image src={option.icon} alt={option.name} />
                  <span>{option.name}</span>
                  <Button
                    type="button"
                    className={style.removeBtn}
                    theme="danger"
                    onClick={(e) => removeOption(option.id, e)}
                  >
                    <FaTimes size={10} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={style.chevron}>
          <FaChevronDown size={12} />
        </div>
      </div>

      {error && <small className={style.error}>{error}</small>}

      {isOpen && (
        <div className={style.dropdownMenu}>
          <div className={style.searchBox}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search MCPs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className={style.optionsList}>
            {filteredOptions.length === 0 ? (
              <div className={style.noResults}>
                <p>No MCPs found</p>
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <div
                    key={option.id}
                    className={`${style.option} ${
                      isSelected ? style.selected : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOption(option.id);
                    }}
                  >
                    <div className={style.checkbox}>
                      {isSelected && <FaCheck size={12} />}
                    </div>
                    <Image src={option.icon} alt={option.name} />
                    <div className={style.optionInfo}>
                      <div className={style.optionName}>{option.name}</div>
                      <div className={style.optionMeta}>
                        v{option.version} • {option.Tools.length} tool
                        {option.Tools.length !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {selectedOptions.length > 0 && (
            <div className={style.footer}>
              <span className={style.selectedCount}>
                {selectedOptions.length} selected
              </span>
              <button
                type="button"
                className={style.clearBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
