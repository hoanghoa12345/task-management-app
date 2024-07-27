"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import CardWrapper from "../../_components/card-wrapper/card-wrapper";
import { register } from "@/actions/register";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schema/auth";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const SignUpForm = () => {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
     register(values).then((data) => {
        setMessage(data?.message as string);
      })
      .catch((error) => setMessage("Error handler: " + error.message));
    });
  };
  return (
    <CardWrapper
        title="Create an account"
        description="Enter your email below to create your account"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-2 space-y-2 flex flex-col"
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
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
                <span>Sign Up</span>
              )}
            </Button>
            <div className="text-sm py-2 text-zinc-600 underline">
              <Link href="/sign-in">
                I already have an account
              </Link>
            </div>
          </form>
        </Form>
      </CardWrapper>
  )
}

export default SignUpForm