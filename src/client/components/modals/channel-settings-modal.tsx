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
import { useAppDispatch, useAppSelector } from "../../hooks";
import { onClose } from "../../redux/slices/modalSlice";
import { updateChannel } from "../../redux/slices/channelSlice";
import { RootState } from "../../redux/store";
import { useEffect } from "react";
import { ChannelsSchema } from "@/src/schemas";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ChannelSettingsModal() {
  const dispatch = useAppDispatch();
  const { loading, currentChannel } = useAppSelector(
    (state: RootState) => state.channelReducer,
  );
  const { isOpen, type } = useAppSelector(
    (state: RootState) => state.modalReducer,
  );

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

    const result = await dispatch(
      updateChannel({ data: values, channelId: String(currentChannel.id) }),
    );
    if (updateChannel.fulfilled.match(result)) {
      dispatch(onClose());
    }
  };

  const handleClose = () => {
    form.reset();
    dispatch(onClose());
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
                    disabled={loading}
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
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
