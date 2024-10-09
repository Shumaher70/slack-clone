import { toast } from "sonner";
import { CopyIcon, RefreshCcw } from "lucide-react";

import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";

import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

interface InviteModalProps {
  open: boolean;
  name: string;
  joinCode: string;
  setOpen: (open: boolean) => void;
}

export const InviteModal = ({
  open,
  name,
  setOpen,
  joinCode,
}: InviteModalProps) => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure",
    "This will deactivate the current invite code and generate a new one",
  );

  const { mutate, isPending } = useNewJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Invite code regenerated");
        },
        onError: () => toast.error("Failed to regenerate invite code"),
      },
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <CopyIcon />

            <DialogDescription>
              Use the code below to invite people to your workspace
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-y-4 py-10">
            <p className="text-4xl font-bold uppercase tracking-widest">
              {joinCode}
            </p>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              Copy link
              <CopyIcon className="ml-2 size-4" />
            </Button>
          </div>
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              disabled={isPending}
              onClick={handleNewCode}
            >
              New code
              <RefreshCcw className="ml-2 size-4" />
            </Button>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
