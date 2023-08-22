"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/Form";
import { Input } from "@/components/Input";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/Button";
import { useLinkStore } from "./store";
import { fetchMetadata } from "@/utils";

const linkFormSchema = z.object({
  link: z.string().url({ message: "Please enter a valid URL." }),
});

type LinkFormValues = z.infer<typeof linkFormSchema>;

// https://stackoverflow.com/a/47012342 : add defaultValue for input fields bug fix
const defaultValues: Partial<LinkFormValues> = {
  link: "",
};

export default function LinkForm({ closeDialog }: { closeDialog: () => void }) {
  const addLoadingLink = useLinkStore((state) => state.addLoadingLink);
  const setLoadedLink = useLinkStore((state) => state.setLoadedLink);

  const form = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    defaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: LinkFormValues) {
    closeDialog();

    const linkID = uuidv4();
    addLoadingLink({ id: linkID, isLoading: true, url: data.link });
    const fetchedMetadata = await fetchMetadata(data.link);
    setLoadedLink(fetchedMetadata);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-2.5"
      >
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Paste a web link" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          Add link
        </Button>
      </form>
    </Form>
  );
}
