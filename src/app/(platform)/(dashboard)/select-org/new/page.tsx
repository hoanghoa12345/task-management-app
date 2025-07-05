"use client";

import { useAction } from "@/hooks/use-action";
import { createOrganization } from "@/actions/create-organization";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const NewOrganizationPage = () => {
  const router = useRouter();
  const { pending } = useFormStatus();
  const { execute, fieldErrors } = useAction(createOrganization, {
    onSuccess(data) {
      toast.success(`Organization ${data.name} created!`);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const slug = formData.get("slug") as string;

    execute({ name, imageUrl, slug });
  };

  const onCancel = () => {
    router.push("/select-org");
  };

  return (
    <div className="flex flex-1 w-full overflow-y-hidden">
      <div className="flex justify-center items-center w-full h-full">
        <form action={onSubmit}>
          <div className="w-[400px] md:w-[450px] bg-card rounded-md border shadow-sm overflow-hidden my-20">
            <div className="border-b border-default flex items-center p-4">
              <h4>Create a new organization</h4>
            </div>
            <div className="p-4 space-y-2">
              <FormInput
                label="Organization name"
                type="text"
                id="name"
                errors={fieldErrors}
              />
              <FormInput
                label="Organization thumbnail"
                type="text"
                id="imageUrl"
                errors={fieldErrors}
              />
              <FormInput
                label="Organization slug"
                type="text"
                id="slug"
                errors={fieldErrors}
              />
            </div>
            <div className="border-t border-default flex items-center p-4">
              <div className="flex w-full gap-2 justify-between">
                <Button type="button" variant={'secondary'} onClick={onCancel} size={'sm'} className="text-sm">
                  Cancel
                </Button>
                <Button type="submit" disabled={pending} size={'sm'} className="text-sm">
                  Create
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrganizationPage;
