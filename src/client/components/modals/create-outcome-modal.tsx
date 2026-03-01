import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  // Dialog,
  // DialogContent,
  // DialogDescription,
  // DialogFooter,
  // DialogHeader,
  // DialogTitle,
  Label,
} from "@/src/client/components/ui";
import { Modal } from "@/src/client/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/client/components/ui/select";
import { useModalStore } from "@/src/client/stores/modal-store";
import { useState, useEffect } from "react";
import { OutcomeType } from "@/src/client/lib/types";
import { useChannelMembers, useChannelOutcomes } from "../../pages/chat/hooks";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const OutcomeSchema = z.object({
  type: z.enum(["DECISION", "ACTION"]),
  assignedId: z.string().optional(),
});

export default function CreateOutcomeModal() {
  const { isOpen, type, data, onClose } = useModalStore();

  const isModalOpen = isOpen && type === "createOutcome";
  const { message } = data || {};

  const { members } = useChannelMembers(message?.channelId || null);
  const { createOutcome, isCreating } = useChannelOutcomes(
    message?.channelId || null,
  );

  const form = useForm<z.infer<typeof OutcomeSchema>>({
    resolver: zodResolver(OutcomeSchema),
    defaultValues: {
      type: "DECISION",
      assignedId: "",
    },
  });

  const outcomeType = form.watch("type");

  useEffect(() => {
    if (isModalOpen) {
      form.reset({
        type: "DECISION",
        assignedId: "",
      });
    }
  }, [isModalOpen, form]);

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const handleCreate = async (values: z.infer<typeof OutcomeSchema>) => {
    if (!message) return;

    try {
      await createOutcome({
        messageId: String(message.id),
        type: values.type,
        assignedId:
          values.type === "ACTION" && values.assignedId
            ? values.assignedId
            : null,
      });
      toast.success("Outcome created successfully");
      handleClose();
    } catch (error) {
      console.error("Failed to create outcome:", error);
      toast.error("Failed to create outcome. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      title="Create Outcome"
      description="Turn this conversation into a durable outcome."
      onClose={handleClose}
      className="sm:max-w-[425px] dark:bg-gradient-to-b dark:from-[#12372A] dark:to-[#0d2a1f] dark:border-[#ADBC9F]/20 dark:text-white"
    >
      {message && (
        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg text-sm text-gray-600 dark:text-gray-300 mb-4 border border-gray-100 dark:border-white/10 italic">
          "{message.content}"
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreate)}
          className="grid gap-4 py-4"
        >
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="grid gap-2">
                <FormLabel className="dark:text-white">Outcome Type</FormLabel>
                <FormControl>
                  <div className="flex gap-4">
                    <label className="flex items-center space-x-2 cursor-pointer border dark:border-white/10 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-500/10 has-[:checked]:border-blue-200 dark:has-[:checked]:border-blue-500/30 transition-colors">
                      <input
                        type="radio"
                        value="DECISION"
                        checked={field.value === "DECISION"}
                        onChange={() => field.onChange("DECISION")}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium dark:text-white">
                        Decision
                      </span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer border dark:border-white/10 p-3 rounded-md hover:bg-gray-50 dark:hover:bg-white/5 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-500/10 has-[:checked]:border-blue-200 dark:has-[:checked]:border-blue-500/30 transition-colors">
                      <input
                        type="radio"
                        value="ACTION"
                        checked={field.value === "ACTION"}
                        onChange={() => field.onChange("ACTION")}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium dark:text-white">
                        Action
                      </span>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {outcomeType === "ACTION" && (
            <FormField
              control={form.control}
              name="assignedId"
              render={({ field }) => (
                <FormItem className="grid gap-2 animate-in fade-in slide-in-from-top-1">
                  <FormLabel className="dark:text-white">
                    Assignee (Optional)
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger
                        id="assignee"
                        className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                      >
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="dark:bg-[#12372A] dark:border-[#ADBC9F]/20 dark:text-white">
                      {members.map((member) => (
                        <SelectItem
                          key={member.id}
                          value={String(member.id)}
                          className="dark:focus:bg-white/10"
                        >
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-[#ADBC9F] dark:text-[#12372A] dark:hover:bg-[#ADBC9F]/90 transition-colors"
            >
              {isCreating ? "Creating..." : "Create Outcome"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
