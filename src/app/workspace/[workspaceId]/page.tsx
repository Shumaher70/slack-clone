"use client";

import { Loader, TriangleAlert } from "lucide-react";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";

const WorkspaceIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [open, setOpen] = useCreateChannelModal();

  const { data: member, isLoading: memberIsLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

  useEffect(() => {
    if (
      !member ||
      !workspace ||
      channelsLoading ||
      memberIsLoading ||
      workspaceLoading
    )
      return;

    if (channelId) {
      router.push(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    open,
    router,
    member,
    isAdmin,
    setOpen,
    channels,
    workspace,
    workspaceId,
    memberIsLoading,
    channelsLoading,
    workspaceLoading,
  ]);

  if (workspaceLoading || channelsLoading || memberIsLoading) {
    return (
      <div className="h-full flex-1 flex-col items-center justify-center gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex-col items-center justify-center gap-2">
        <TriangleAlert className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Workspace not found
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex-col items-center justify-center gap-2">
      <TriangleAlert className="size-6 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">No channel found</span>
    </div>
  );
};

export default WorkspaceIdPage;
