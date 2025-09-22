import React, { useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRooms } from "../../../hooks/useRooms";
import { useActiveRoom } from "../../../stores/room.store";
import { useCreateRoom } from "../../../hooks/useCreateRoom";
import "./RoomLayout.css";
import bot from "../../../assets/images/bot.png";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Modal from "../../components/Modal/Modal";
import Loader from "../../components/Loader/Loader";
import {
  AiOutlinePlus,
  AiOutlineRobot,
  AiOutlineSetting,
} from "react-icons/ai";

// Zod schema for room creation validation
const createRoomSchema = z.object({
  name: z
    .string()
    .min(1, "Room name is required")
    .min(3, "Room name must be at least 3 characters")
    .max(50, "Room name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Room name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
});

type CreateRoomFormData = z.infer<typeof createRoomSchema>;

const RoomLayout = () => {
  const [, setSearchParams] = useSearchParams();
  const nav = useNavigate();
  const { wsId, teamId, roomId } = useParams();
  const numericRoomId = roomId ? parseInt(roomId, 10) : undefined;
  const [showCreate, setShowCreate] = useState(false);

  // Form setup with react-hook-form and zod validation
  const { control, handleSubmit, reset } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
  });

  // Mutation for creating room
  const { mutateAsync, isPending } = useCreateRoom();

  // Form submission handler
  const onSubmit = async (data: CreateRoomFormData) => {
    try {
      const result = await mutateAsync({
        createRoomInput: { name: data.name },
      });

      if (result?.createRoom) {
        // Close modal and reset form
        setShowCreate(false);
        reset();

        // Navigate to the newly created room
        nav(`/workspace/${wsId}/team/${teamId}/room/${result.createRoom.id}`);
      }
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error("Room creation failed:", error);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowCreate(false);
    reset();
  };

  const { setActiveRoom, id: activeRoomId } = useActiveRoom();

  // Query for fetching rooms
  const {
    data: roomsData,
    isLoading: loadingRooms,
    error: roomsError,
    refetch: refetchRooms,
  } = useRooms();

  // Auto-select room from URL if not already active
  React.useEffect(() => {
    if (
      numericRoomId &&
      roomsData?.myRooms &&
      activeRoomId !== numericRoomId.toString()
    ) {
      const room = roomsData.myRooms.find((r) => r.id === numericRoomId);
      if (room) {
        setActiveRoom({
          id: room.id.toString(), // Convert to string for store
          name: room.name,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt,
        });
      }
    }
  }, [numericRoomId, roomsData, activeRoomId, setActiveRoom]);

  return (
    <main className="room-layout">
      <div className="rooms-sidebar glass-bg">
        <div className="headline">
          <h1>Rooms</h1>

          <div className="actions">
            <Button
              href={`/workspace/${wsId}/team/${teamId}/agents`}
              className="tooltip tooltip-bottom"
              data-tooltip="Team Agents"
            >
              <AiOutlineRobot />
            </Button>

            <Button
              className="tooltip tooltip-bottom"
              data-tooltip="Team Settings"
              onClick={() =>
                setSearchParams({ edit: "team" }, { replace: true })
              }
            >
              <AiOutlineSetting />
            </Button>
          </div>
        </div>

        <div className="search-area">
          <Input className="search-input" placeholder="Search for a room" />
          <Button theme="borderd" onClick={() => setShowCreate(true)}>
            <AiOutlinePlus size={18} />
          </Button>
        </div>

        <div className="rooms-list">
          {loadingRooms ? (
            <div className="loading-container">
              <Loader />
              <p>Loading rooms...</p>
            </div>
          ) : roomsError ? (
            <div className="error-container">
              <p>Error loading rooms</p>
              <Button onClick={() => refetchRooms()}>Retry</Button>
            </div>
          ) : (roomsData?.myRooms || []).length > 0 ? (
            (roomsData?.myRooms || []).map((room) => (
              <div key={room.id}>
                <NavLink to={`room/${room.id}`} end className={`room-item`}>
                  {room.name}
                </NavLink>
              </div>
            ))
          ) : (
            <div className="empty-container">
              <p>No rooms found</p>
              <Button onClick={() => refetchRooms()}>Refresh</Button>
            </div>
          )}
        </div>
      </div>
      <div className="view-area">
        <Outlet />
      </div>

      <Modal
        open={showCreate}
        title="Create Room"
        onClose={handleModalClose}
        onSave={handleSubmit(onSubmit)}
        isLoading={isPending}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState?.error?.message}
                  placeholder="Room name"
                />
              )}
            />
          </div>
        </form>
      </Modal>
    </main>
  );
};

export const SelectRoom = () => {
  return (
    <>
      <div className="select-workspace-area">
        <img src={bot} alt="bot" />
        <h1>Let's Start Conversation</h1>
        <p>Select a room to start your conversation</p>
      </div>
    </>
  );
};

export default RoomLayout;
