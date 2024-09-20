"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { UserButton } from "@/features/auth/components/user-button";

import { useGetWorkspaces } from "@/features/auth/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/auth/workspaces/store/use-create-workspace-modal";

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useCreateWorkspaceModal();

  const { data, isLoading } = useGetWorkspaces();

  const workspaceId = useMemo(() => data?.[0]?._id, [data]);

  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if (!open) {
      setOpen(true);
    }
  }, [open, setOpen, router, isLoading, workspaceId]);

  return (
    <div>
      <UserButton />
    </div>
  );
}
