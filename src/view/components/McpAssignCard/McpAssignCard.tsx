import style from "./McpAssignCard.module.css";
import type { AvailableWsMcpItem } from "../../../services/Queries/Workspaces.gql";
import Image from "../Image/Image";
import Toggle from "../Toggle/Toggle";
import Checkbox from "../Checkbox/Checkbox";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAssignMcp } from "../../../hooks/useAssignMcp";
import useFetch from "../../../hooks/useFetch";
import Loader from "../Loader/Loader";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "../Modal/Modal";

// إنشاء validation schema ديناميكي
const validationSchema = z.object({
  Tools: z
    .array(
      z.object({
        id: z.string(),
        isSelected: z.boolean(),
      })
    )
    .min(1, { message: "At least one tool is required" }),
  Envs: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .nullable()
    .default([]),
});

const McpAssignCard = ({
  mcp,
  onUpdate = () => {},
}: {
  mcp: AvailableWsMcpItem;
  onUpdate?: () => void;
}) => {
  const [showAssign, setShowAssign] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);

  // إعداد القيم الافتراضية
  const getDefaultValues = useCallback(() => {
    const toolsData: { id: string; isSelected: boolean }[] = [];
    mcp.Tools.forEach((tool) => {
      toolsData.push({
        id: String(tool.id),
        isSelected: tool.isSelected || false,
      });
    });

    const envsData: { key: string; value: string }[] = [];
    mcp.Requirements.forEach((req) => {
      envsData.push({
        key: req.key,
        value: mcp.Envs.find((env) => env.key === req.key)?.value || "",
      });
    });

    return {
      Tools: toolsData,
      Envs: envsData,
    };
  }, [mcp.Tools, mcp.Requirements, mcp.Envs]);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: getDefaultValues(),
    shouldUnregister: true,
    mode: "all",
  });

  const { assignMutation, deleteMutation, updateMutation } = useAssignMcp();
  const fetchData = useFetch();

  useEffect(() => {
    setShowAssign(mcp.isSelected);
  }, [mcp.isSelected]);

  useEffect(() => {
    reset(getDefaultValues());
  }, [mcp.Tools, mcp.Requirements, reset, getDefaultValues]);

  const onSubmit = async (formData: any) => {
    try {
      // استخراج IDs الأدوات المحددة
      const selectedToolsIds = formData.Tools.filter(
        (tool: any) => tool.isSelected
      ).map((tool: any) => parseInt(tool.id));

      // التحقق من وجود أدوات محددة على الأقل
      if (selectedToolsIds.length === 0) {
        alert("يجب اختيار أداة واحدة على الأقل");
        return;
      }

      // إعداد متغيرات البيئة
      const envVariables: Array<{ key: string; value: string }> = [];

      // التحقق من الحقول المطلوبة
      for (const req of mcp.Requirements) {
        const value = (
          formData.Envs.find((env: any) => env.key === req.key)?.value || ""
        ).toString();
        if (!value.trim()) {
          alert(`${req.key} مطلوب`);
          return;
        }
        envVariables.push({
          key: req.key,
          value: value.trim(),
        });
      }

      // إعداد بيانات الـ mutation
      const mutationData = {
        createWorkspaceMcpInput: {
          mcpId: parseInt(mcp.id),
          toolsIds: selectedToolsIds,
          env: envVariables,
        },
      };

      // تنفيذ الـ mutation
      await fetchData(
        assignMutation.mutateAsync,
        { success: true, error: true },
        mutationData
      );

      onUpdate();
    } catch (error) {
      console.error("فشل في تعيين MCP:", error);
    }
  };

  const onMcpUpdate = async (formData: any) => {
    if (!mcp.id) {
      console.error("No workspace MCP ID provided for update");
      return;
    }

    try {
      // استخراج IDs الأدوات المحددة
      const selectedToolsIds = formData.Tools.filter(
        (tool: any) => tool.isSelected
      ).map((tool: any) => parseInt(tool.id));

      // إعداد متغيرات البيئة
      const envVariables: Array<{ key: string; value: string }> = [];

      // التحقق من الحقول المطلوبة
      for (const req of mcp.Requirements) {
        const value = (
          formData.Envs.find((env: any) => env.key === req.key)?.value || ""
        ).toString();
        if (!value.trim()) {
          alert(`${req.key} مطلوب`);
          return;
        }
        envVariables.push({
          key: req.key,
          value: value.trim(),
        });
      }

      // إعداد بيانات الـ mutation
      const mutationData = {
        updateWorkspaceMcpInput: {
          workspaceMcpId: mcp.workspaceMcpId,
          toolsIds: selectedToolsIds,
          env: envVariables,
        },
      };

      // تنفيذ الـ mutation
      await fetchData(
        updateMutation.mutateAsync,
        { success: true, error: true },
        mutationData
      );

      onUpdate();
      setShowAssign(false);
    } catch (error) {
      console.error("فشل في تحديث MCP:", error);
    }
  };

  const handleDeleteMethod = async () => {
    if (!deleteId) return;

    try {
      await fetchData(
        deleteMutation.mutateAsync,
        { success: true, error: true },
        { id: Number(deleteId) }
      );

      onUpdate();
      setDeleteId(null);
    } catch (error) {
      console.error("Couldn't delete MCP:", error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(mcp.isSelected ? onMcpUpdate : onSubmit)}
        className={`${style.mcpAssignCard} glass-bg`}
      >
        <div className={style.card_head}>
          <div className={style.head_info}>
            <Image className="avatar" />
            <p>{mcp.name}</p>
          </div>

          <div>
            <Toggle
              theme={mcp.isSelected ? "success" : "tertiary"}
              checked={showAssign}
              onChange={(e: any) => {
                if (mcp.isSelected) {
                  setDeleteId(mcp.id);
                } else {
                  setShowAssign(e);
                }
              }}
            />
          </div>
        </div>

        <div className={style.description}>
          <p>{mcp.description}</p>
        </div>

        {showAssign && mcp.Tools.length > 0 && (
          <div className={style.mcp_list_box}>
            <h4>Tools</h4>
            {errors.Tools && (
              <p className={style.error_message}>
                {errors.Tools.message?.toString()}
              </p>
            )}
            <div className={style.tools_list}>
              {mcp.Tools.map((tool, idx) => (
                <Controller
                  key={tool.id}
                  control={control}
                  name={`Tools.${idx}`}
                  render={({ field }) => (
                    <div key={tool.id} className={style.checkbox_wrapper}>
                      <Checkbox
                        theme="primary"
                        checked={field.value.isSelected}
                        onChange={(e) =>
                          field.onChange({ id: String(tool.id), isSelected: e })
                        }
                      >
                        {tool.name}
                      </Checkbox>
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {showAssign && mcp.Requirements.length > 0 && (
          <div className={style.mcp_list_box}>
            <h4>API Configuration</h4>
            <div className={style.api_config_list}>
              {mcp.Requirements.map((req, idx) => (
                <Controller
                  key={req.id}
                  control={control}
                  name={`Envs.${idx}`}
                  render={({ field, fieldState }) => (
                    <div key={req.key} className={style.input_wrapper}>
                      <Input
                        label={req.key}
                        placeholder="Enter token"
                        value={field.value.value}
                        onChange={(e) =>
                          field.onChange({ ...field.value, value: e })
                        }
                        error={fieldState.error?.message}
                      />
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
        )}

        {!mcp.isSelected && showAssign && (
          <Button
            type="submit"
            theme="primary"
            className={style.assign_btn}
            disabled={assignMutation.isPending}
          >
            {assignMutation.isPending && <Loader />}
            {assignMutation.isPending ? "Assigning" : "Assign"}
          </Button>
        )}

        {mcp.isSelected && (
          <Button
            type="submit"
            theme="primary"
            className={style.assign_btn}
            disabled={!isDirty || updateMutation.isPending}
          >
            {updateMutation.isPending && <Loader />}
            {updateMutation.isPending ? "Saving" : "Save"}
          </Button>
        )}
      </form>

      <Modal
        open={!!deleteId}
        title="Delete MCP"
        onClose={() => setDeleteId(null)}
        onSave={handleDeleteMethod}
        cancellable
      >
        <p>Are you sure you want to delete this MCP from the workspace?</p>
      </Modal>
    </>
  );
};

export default McpAssignCard;
