import { ChannelsSchema } from "@/src/schemas";
import { useAppDispatch, useAppSelector } from "@/src/client/hooks";
import { RootState } from "@/src/client/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { onClose } from "../../redux/slices/modalSlice";
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
import { createChannelAsync } from "../../redux/slices/channelSlice";

export default function CreateChannelModal() {
  const { isOpen, type } = useAppSelector(
    (state: RootState) => state.modalReducer,
  );
  const { loading } = useAppSelector(
    (state: RootState) => state.channelReducer,
  );
  const dispatch = useAppDispatch();

  const isCreateChannelModalOpen = isOpen && type === "createChannel";

  const form = useForm<z.infer<typeof ChannelsSchema>>({
    resolver: zodResolver(ChannelsSchema),
    defaultValues: {
      name: "",
    },
  });

  const createChannelSubmit = async (
    values: z.infer<typeof ChannelsSchema>,
  ) => {
    const result = await dispatch(createChannelAsync(values));
    if (createChannelAsync.fulfilled.match(result)) {
      dispatch(onClose());
    }
    form.reset();
  };

  const handleClose = () => {
    dispatch(onClose());
  };

  return (
    <Modal
      isOpen={isCreateChannelModalOpen}
      title="Create Channel"
      description="Enter a name for your new channel"
      onClose={handleClose}
      className="sm:max-w-[425px] dark:bg-gradient-to-b dark:from-[#12372A] dark:to-[#0d2a1f] dark:border-[#ADBC9F]/20 dark:text-white"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createChannelSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="grid gap-4 py-4">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Channel name (e.g., project-alpha)"
                    type="text"
                    disabled={loading}
                    className="col-span-4 dark:bg-white/5 dark:border-white/10 dark:text-white"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end py-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-[#ADBC9F] dark:text-[#12372A] dark:hover:bg-[#ADBC9F]/90 transition-colors"
              disabled={loading}
            >
              {loading ? "Creating...." : "Create Channel"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
