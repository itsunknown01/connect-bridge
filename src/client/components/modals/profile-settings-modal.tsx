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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { onClose } from "../../redux/slices/modalSlice";
import { DialogFooter } from "../ui/dialog";
import { useEffect } from "react";
import { updateUserProfileAsync } from "../../redux/slices/authSlice";
import { ProfileSchema } from "@/src/schemas";

export default function ProfileSettingsModal() {
  const { isOpen, type } = useAppSelector((state) => state.modalReducer);
  const { currentUser, loading } = useAppSelector((state) => state.authReducer);

  const dispatch = useAppDispatch();
  const form = useForm({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const isModalOpen = isOpen && type === "profileSettings";

  // Reset form with current user data when modal opens
  useEffect(() => {
    if (isModalOpen && currentUser) {
      form.reset({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
    }
  }, [isModalOpen, currentUser, form]);

  const handleClose = () => dispatch(onClose());

  const onSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    const result = await dispatch(updateUserProfileAsync(values));

    if (updateUserProfileAsync.fulfilled.match(result)) {
      dispatch(onClose());
    }
  };

  return (
    <Modal
      title="Profile Settings"
      description="Update your personal information and preferences"
      isOpen={isModalOpen}
      onClose={handleClose}
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
          <DialogFooter className="flex gap-2 justify-end py-2">
            <Button variant="outline" onClick={handleClose} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#12372A] hover:bg-[#12372A]/90 text-white"
              disabled={loading}
            >
              {loading ? "Saving...." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </Modal>
  );
}
