import Link from "next/link";
import GoogleSigninButton from "../GoogleSigninButton";
import {SignUpForm} from "../../../app/forms/form-layout/_components/sign-up-form";


export default function Signup() {
  return (
    <>
      <GoogleSigninButton text="Sign Up" />

      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign Up with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SignUpForm />
      </div>

      <div className="mt-6 text-center">
        <p>
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary">
            Sign In
          </Link>
        </p>
      </div>
    </>
  );
}
