import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useModalStore } from "@/src/client/stores/modal-store";
import { useChannelStore } from "@/src/client/stores/channel-store";
import { useInviteMember } from "@/src/client/hooks/api/use-channel-queries";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from "../ui";
import { Modal } from "../ui/modal";

const InviteSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export default function InviteMembersModal() {
  const { onClose } = useModalStore();
  const { currentChannel } = useChannelStore();
  const { isOpen, type } = useModalStore();
  const inviteMember = useInviteMember();
  const [copied, setCopied] = useState(false);
  const isModalOpen = isOpen && type === "inviteMembers";

  const form = useForm<z.infer<typeof InviteSchema>>({
    resolver: zodResolver(InviteSchema),
    defaultValues: {
      email: "",
    },
  });

  // Generate invite link
  const inviteLink = currentChannel
    ? `${window.location.origin}/invite/${currentChannel.id}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success("Invite link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleInvite = async (values: z.infer<typeof InviteSchema>) => {
    if (!currentChannel) return;

    try {
      await inviteMember.mutateAsync({
        channelId: String(currentChannel.id),
        email: values.email,
      });
      form.reset();
    } catch {
      // Error handled by mutation
    }
  };

  const handleClose = () => {
    setCopied(false);
    form.reset();
    onClose();
  };

  if (!currentChannel) return null;

  return (
    <Modal
      isOpen={isModalOpen}
      title="Invite Members"
      description={`Invite people to join #${currentChannel.name}`}
      onClose={handleClose}
      className="sm:max-w-[425px] dark:bg-gradient-to-b dark:from-[#12372A] dark:to-[#0d2a1f] dark:border-[#ADBC9F]/20 dark:text-white"
    >
      <div className="space-y-6 py-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleInvite)}
            className="space-y-4"
          >
            {/* Email Invite Section */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="dark:text-white">
                    Invite by Email
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="colleague@example.com"
                          className="pl-9 dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-gray-500"
                          disabled={inviteMember.isPending}
                          {...field}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={inviteMember.isPending}
                        className="bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-[#ADBC9F] dark:text-[#12372A] dark:hover:bg-[#ADBC9F]/90 transition-colors"
                      >
                        {inviteMember.isPending ? "Sending..." : "Invite"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t dark:border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-[#12372A] px-2 text-muted-foreground dark:text-white/40">
              Or share link
            </span>
          </div>
        </div>

        {/* Link Share Section */}
        <div className="space-y-2">
          <Label className="dark:text-white">Invite Link</Label>
          <div className="flex gap-2">
            <Input
              value={inviteLink}
              readOnly
              className="flex-1 bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-white text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className={
                copied
                  ? "text-green-600 border-green-600 dark:text-green-400 dark:border-green-400"
                  : "dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
              }
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-700 dark:text-blue-300 text-xs border border-blue-100 dark:border-blue-500/20">
          <UserPlus className="h-4 w-4" />
          <p>Anyone with the link can join this channel</p>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
