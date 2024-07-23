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
      <div className="text-sm">
        <span className="mr-1">Create an account</span>
        <Link className="font-semibold" href="/register">Register</Link>
      </div>
    </div>
  );
};

export default LoginPage;
