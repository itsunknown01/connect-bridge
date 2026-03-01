import { ChannelsSchema } from "@/src/schemas";
import { useModalStore } from "@/src/client/stores/modal-store";
import { useCreateChannel } from "@/src/client/hooks/api/use-channel-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

export default function CreateChannelModal() {
  const { isOpen, type, onClose } = useModalStore();
  const createChannel = useCreateChannel();

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
    try {
      await createChannel.mutateAsync(values);
      onClose();
    } catch {
      // Error handled by mutation
    }
    form.reset();
  };

  const handleClose = () => {
    onClose();
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
                    disabled={createChannel.isPending}
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
              disabled={createChannel.isPending}
            >
              {createChannel.isPending ? "Creating...." : "Create Channel"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
