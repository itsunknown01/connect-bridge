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
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "../ui/dialog";
import { Modal } from "../ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModalStore } from "@/src/client/stores/modal-store";
import { useAuthStore } from "@/src/client/stores/auth-store";
import { useEffect } from "react";
import { useUpdateProfile } from "@/src/client/hooks/api/use-auth-queries";
import { ProfileSchema } from "@/src/schemas";

export default function ProfileSettingsModal() {
  const { isOpen, type, onClose } = useModalStore();
  const { currentUser, loading } = useAuthStore();
  const updateProfile = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const isModalOpen = isOpen && type === "profileSettings";

  useEffect(() => {
    if (isModalOpen && currentUser) {
      form.reset({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
    }
  }, [isModalOpen, currentUser, form]);

  const handleClose = () => onClose();

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    try {
      await updateProfile.mutateAsync(values);
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Modal
      isOpen={isModalOpen}
      title="Profile Settings"
      description="Update your personal information and preferences"
      onClose={handleClose}
      className="sm:max-w-[425px] dark:bg-gradient-to-b dark:from-[#12372A] dark:to-[#0d2a1f] dark:border-[#ADBC9F]/20 dark:text-white"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" disabled={loading} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end py-2">
            <Button variant="outline" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#12372A] hover:bg-[#12372A]/90 text-white dark:bg-[#ADBC9F] dark:text-[#12372A] dark:hover:bg-[#ADBC9F]/90 transition-colors"
              disabled={loading}
            >
              {loading ? "Saving...." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
}
