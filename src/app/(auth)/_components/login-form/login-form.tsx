"use client"

import React, { useState } from 'react'
import CardWrapper from '../card-wrapper/card-wrapper'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoginSchema } from '@/schema/auth'
import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation'
import { login } from '@/actions/login'
const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(values: z.infer<typeof LoginSchema>) {
    console.log(values)
    startTransition(() => login(values, callbackUrl)
      .then(data => setMessage(data.message))
      .catch(error => setMessage(error.message))
    )
  }

  return (
    <>
      <CardWrapper title="Login" description="Enter your credentials to access your account">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" type='email' {...field} />
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
                    <Input placeholder="password" type='password' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-center text-red-500">{message}</p>
            <Button type="submit" disabled={isPending}>Submit</Button>
          </form>
        </Form>
      </CardWrapper>
    </>
  )
}

export default LoginForm
