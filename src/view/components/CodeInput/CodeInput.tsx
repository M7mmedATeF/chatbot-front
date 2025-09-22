import { useState } from "react";
import styles from "./CodeInput.module.css";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import Textarea from "../Textarea/Textarea";
import { useContextMenuHandler } from "../../../hooks/useContextMenuHandler";
import { useFieldArray, type Control } from "react-hook-form";

const CodeInput = ({
  control,
  name,
}: {
  control: Control<any>;
  name: string;
}) => {
  const handleContextMenu = useContextMenuHandler();
  const [active, setActive] = useState<number>(0);

  const { fields, append, remove, update } = useFieldArray<any, any, any>({
    control,
    name,
    shouldUnregister: true,
  });

  const addTab = () => {
    append({ code: "", is_main: false });
  };

  const removeTab = (index: number) => {
    remove(index);
    if (active === index) {
      setActive(0);
    }
  };

  const setTabAsMCP = (index: number) => {
    fields.forEach((field, i) => {
      update(i, { ...field, is_main: i === index });
    });
  };

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.tabs}>
          {fields.map((field, index) => (
            <div
              className={`${styles.tab} ${field.is_main ? styles.active : ""}`}
              onClick={() => setActive(index)}
              onContextMenu={handleContextMenu([
                {
                  name: "Delete",
                  onClick: () => removeTab(index),
                },
                {
                  name: "Set as MCP",
                  onClick() {
                    setTabAsMCP(index);
                  },
                },
              ])}
            >
              {!field.is_main && (
                <Button>
                  <FontAwesomeIcon icon={faXmark} />
                </Button>
              )}
              {`tab ${index + 1}`}
              {index === 0 && <span>MCP</span>}
            </div>
          ))}
        </div>

        <Button className={`${styles.tab}`} theme="primary" onClick={addTab}>
          <FontAwesomeIcon icon={faPlus} />
          Add More
        </Button>
      </div>
      <div className={styles.code}>
        <Textarea
          placeholder="Enter Mcp Code"
          value={fields[active].code}
          onChange={(e: any) => update(active, { ...fields[active], code: e })}
        />
      </div>
    </div>
  );
};

export default CodeInput;
