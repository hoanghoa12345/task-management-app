"use client";

import React from "react";
import { useAction } from "@/hooks/use-action";
import { createOrganization } from "@/actions/create-organization";
import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

    execute({ name });
  };

  return (
    <div>
      <div>
      </div>

      <div>
        <form action={onSubmit}>
          <div>
            <Input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter a organization name"
              disabled={pending}
            />
            {fieldErrors?.name ? (
              <div>
                {fieldErrors.name.map((error) => (
                  <p key={error} className="text-rose-500">
                    {error}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          <Button type="submit" disabled={pending}>Submit</Button>
        </form>
      </div>
    </div>
  );
};

export default OrganizationList;
