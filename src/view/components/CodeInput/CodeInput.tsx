import { useState } from "react";
import styles from "./CodeInput.module.css";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Textarea from "../Textarea/Textarea";
import { useContextMenuHandler } from "../../../hooks/useContextMenuHandler";
import { useFieldArray, type Control } from "react-hook-form";
import Modal from "../Modal/Modal";
import Input from "../Input/Input";
import { AiOutlineFileUnknown } from "react-icons/ai";

const CodeInput: React.FC<{
  control: Control<any>;
  name: string;
  FileType?: string;
  isEditMode?: boolean;
}> = ({
  control,
  name,
  FileType = ".js",
  isEditMode = false,
}: {
  control: Control<any>;
  name: string;
  FileType?: string;
  isEditMode?: boolean;
}) => {
  const [filename, setFileName] = useState("");
  const handleContextMenu = useContextMenuHandler();
  const [active, setActive] = useState<number>(0);
  const [showModal, setShowModal] = useState<number | null>(null);

  const { fields, append, remove, update } = useFieldArray<any, any, any, any>({
    control,
    name,
    shouldUnregister: true,
    keyName: "id",
  });

  const addTab = (is_main: boolean = false) => {
    append({
      code: "",
      is_main,
      // Ensure the name is always unique
      name: (() => {
        if (fields.length === 0) return "index";
        // Collect all current names
        const existingNames = new Set(fields.map((f) => f.name));
        // Try "New File (n)" until unique
        let n = 1;
        let candidate;
        do {
          candidate = `New File (${n})`;
          n++;
        } while (existingNames.has(candidate));
        return candidate;
      })(),
    });
  };

  const removeTab = (index: number) => {
    remove(index);
    if (active >= index) {
      setActive(active - 1);
    }
  };

  const setTabAsMCP = (index: number) => {
    fields.forEach((field, i) => {
      update(i, { ...field, is_main: i === index });
    });
  };

  const renameTab = () => {
    if (filename.trim() === "") return;
    update(showModal as number, {
      ...fields[showModal as number],
      name: filename,
    });
    setFileName("");
    setShowModal(null);
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.tabs}>
          {fields.map((field, index) => (
            <div
              key={index}
              className={`${styles.tab} ${
                active === index ? styles.active : ""
              }`}
              onClick={() => setActive(index)}
              onContextMenu={handleContextMenu([
                {
                  name: "Rename",
                  onClick: () => {
                    setFileName(field.name);
                    setShowModal(index);
                  },
                },
                ...(!field.is_main
                  ? [
                      {
                        name: "Set as MCP",
                        onClick() {
                          setTabAsMCP(index);
                        },
                      },
                    ]
                  : []),
                ...(fields.length > 1
                  ? [
                      {
                        name: "Delete",
                        onClick: () => removeTab(index),
                      },
                    ]
                  : []),
              ])}
            >
              {fields.length > 1 && (
                <Button
                  onClick={(e: any) => {
                    e.stopPropagation();
                    removeTab(index);
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              )}
              {field.name + (isEditMode ? "" : FileType)}
              {field.is_main && <span>MCP</span>}
            </div>
          ))}
        </div>

        <Button
          className={`${styles.tab}`}
          theme="primary"
          onClick={() => addTab(false)}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add File
        </Button>
      </div>
      <div className={styles.code}>
        {fields[active] ? (
          <Textarea
            placeholder="Enter Mcp Code"
            value={fields?.[active]?.code || ""}
            onChange={(e: any) =>
              update(active, { ...fields[active], code: e })
            }
          />
        ) : (
          <div className={styles.empty}>
            <AiOutlineFileUnknown />
            <p>No File Selected</p>
          </div>
        )}
      </div>

      <Modal
        open={showModal != null}
        title="Rename File"
        onClose={() => setShowModal(null)}
        onSave={() => renameTab()}
        cancellable
      >
        <Input
          placeholder="Enter New File Name"
          value={filename}
          onChange={(e: any) => setFileName(e)}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter") {
              renameTab();
            }
          }}
        />
      </Modal>
    </div>
  );
};

export default CodeInput;
