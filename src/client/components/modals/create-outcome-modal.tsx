import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
} from "@/src/client/components/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/client/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
import { onClose } from "@/src/client/redux/slices/modalSlice";
import { useState } from "react";
import { OutcomeType } from "@/src/client/lib/types";
import { useChannelMembers, useChannelOutcomes } from "../../pages/chat/hooks";
import { toast } from "sonner";

export default function CreateOutcomeModal() {
  const { isOpen, type, data } = useAppSelector((state) => state.modalReducer);
  const dispatch = useAppDispatch();
  const [outcomeType, setOutcomeType] = useState<OutcomeType>("DECISION");
  const [assignedId, setAssignedId] = useState<string>("");

  const isModalOpen = isOpen && type === "createOutcome";
  const { message } = data || {};

  const { members } = useChannelMembers(message?.channelId || null);
  const { createOutcome, isCreating } = useChannelOutcomes(
    message?.channelId || null,
  );

  const handleClose = () => {
    dispatch(onClose());
    setOutcomeType("DECISION");
    setAssignedId("");
  };

  const handleCreate = async () => {
    if (!message) return;

    try {
      await createOutcome({
        messageId: String(message.id),
        type: outcomeType,
        assignedId: outcomeType === "ACTION" && assignedId ? assignedId : null,
      });
      toast.success("Outcome created successfully");
      handleClose();
    } catch (error) {
      console.error("Failed to create outcome:", error);
      toast.error("Failed to create outcome. Please try again.");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Outcome</DialogTitle>
          <DialogDescription>
            Turn this conversation into a durable outcome.
          </DialogDescription>
        </DialogHeader>

        {message && (
          <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 mb-4 border border-gray-100 italic">
            "{message.content}"
          </div>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Outcome Type</Label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2 cursor-pointer border p-3 rounded-md hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200 transition-colors">
                <input
                  type="radio"
                  name="outcomeType"
                  value="DECISION"
                  checked={outcomeType === "DECISION"}
                  onChange={() => setOutcomeType("DECISION")}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium">Decision</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer border p-3 rounded-md hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-200 transition-colors">
                <input
                  type="radio"
                  name="outcomeType"
                  value="ACTION"
                  checked={outcomeType === "ACTION"}
                  onChange={() => setOutcomeType("ACTION")}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm font-medium">Action</span>
              </label>
            </div>
          </div>

          {outcomeType === "ACTION" && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-1">
              <Label htmlFor="assignee">Assignee (Optional)</Label>
              <Select value={assignedId} onValueChange={setAssignedId}>
                <SelectTrigger id="assignee">
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={isCreating}
            className="bg-[#12372A] hover:bg-[#12372A]/90 text-white"
          >
            {isCreating ? "Creating..." : "Create Outcome"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
