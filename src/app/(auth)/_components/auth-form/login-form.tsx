"use client";

import React, { useState } from "react";
import CardWrapper from "../card-wrapper/card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schema/auth";
import { useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { login } from "@/actions/login";
import { Loader2 } from "lucide-react";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    startTransition(() =>
      login(values, callbackUrl)
        .then((data) => {
          setMessage(data.message as string);
          if (data?.success) {
            router.replace((callbackUrl as string) || "/");
          }
        })
        .catch((error) => setMessage("Error handler: " + error.message))
    );
  }

  return (
    <>
      <CardWrapper
        title="Login"
        description="Enter your credentials to access your account"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 flex flex-col"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <p className="w-full text-red-500 text-sm">
              {!isPending && message}
            </p>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Please wait</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  );
};

export default LoginForm;
