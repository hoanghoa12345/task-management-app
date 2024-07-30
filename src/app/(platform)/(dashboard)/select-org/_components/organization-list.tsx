"use client";

import React from "react";
import { useAction } from "@/hooks/use-action";
import { createOrganization } from "@/actions/create-organization";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";

const OrganizationList = () => {
  const { pending } = useFormStatus();
  const { execute, fieldErrors } = useAction(createOrganization, {
    onSuccess(data) {
      console.log(data);
    },
    onError(error) {
      console.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const name = formData.get("name") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const slug = formData.get("slug") as string;

    execute({ name, imageUrl, slug });
  };

  return (
    <div>
      <div>
      </div>

      <div>
        <form action={onSubmit}>
          <FormInput label="Organization name" type="text" id="name" errors={fieldErrors} />
          <FormInput label="Organization thumbnail" type="text" id="imageUrl" errors={fieldErrors} />
          <FormInput label="Organization slug" type="text" id="slug" errors={fieldErrors} />
          <Button type="submit" disabled={pending}>Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default OrganizationList;
