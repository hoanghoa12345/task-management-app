import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import LoginForm from "../../_components/login-form/login-form";

export const metadata: Metadata = {
  title: "Login",
};

const LoginPage = () => {
  return (
    <div>
      <LoginForm />
      <Link href="/api/auth/signin">Login</Link>
      <Link href="/register">Register</Link>
    </div>
  );
};

export default LoginPage;
