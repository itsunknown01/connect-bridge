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
import { Modal } from "../ui/modal";
import { z } from "zod";
import { ChannelsSchema } from "@/src/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "../ui/dialog";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { onClose } from "../../redux/slices/modalSlice";
import { updateChannel } from "../../redux/slices/channelSlice";
import { RootState } from "../../redux/store";
import { useEffect } from "react";

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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#12372A] hover:bg-[#12372A]/90 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
}
