import { Metadata } from "next";
import SignUpForm from "../../_components/auth-form/signup-form";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Register your account",
};

const RegisterPage = () => {
  return (
    <div className="w-[372px]">
      <SignUpForm />
    </div>
  );
};

export default RegisterPage;
