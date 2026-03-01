import { useForm } from "react-hook-form";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "../ui";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
import { Modal } from "../ui/modal";
import { useModalStore } from "@/src/client/stores/modal-store";
import { useChannelStore } from "@/src/client/stores/channel-store";
import { useUpdateChannel } from "@/src/client/hooks/api/use-channel-queries";
import { useEffect } from "react";
import { ChannelsSchema } from "@/src/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ChannelSettingsModal() {
  const { onClose } = useModalStore();
  const updateChannel = useUpdateChannel();
  const { currentChannel } = useChannelStore();
  const { isOpen, type } = useModalStore();

  const isChannelSettingsOpen = isOpen && type === "channelSettings";

  const form = useForm<z.infer<typeof ChannelsSchema>>({
    resolver: zodResolver(ChannelsSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset form when modal opens or channel changes
  useEffect(() => {
    if (isChannelSettingsOpen && currentChannel) {
      form.reset({
        name: currentChannel.name || "",
      });
    }
  }, [isChannelSettingsOpen, currentChannel, form]);

  const updateChannelSubmit = async (
    values: z.infer<typeof ChannelsSchema>,
  ) => {
    if (!currentChannel) return;

    try {
      await updateChannel.mutateAsync({
        data: values,
        channelId: String(currentChannel.id),
      });
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isChannelSettingsOpen}
      title="Channel Settings"
      description="Update channel name and settings"
      onClose={handleClose}
      className="sm:max-w-[425px] dark:bg-gradient-to-b dark:from-[#12372A] dark:to-[#0d2a1f] dark:border-[#ADBC9F]/20 dark:text-white"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(updateChannelSubmit)}
          className="space-y-4"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channel Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., project-alpha"
                    type="text"
                    disabled={updateChannel.isPending}
                    className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-[#ADBC9F] dark:text-[#12372A] dark:hover:bg-[#ADBC9F]/90 transition-colors"
              disabled={updateChannel.isPending}
            >
              {updateChannel.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
