import icons from "./icons";
import Link from "next/link";
import UserFormAuth from "./UserFormAuth";
const SignUp = ({}) => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center  space-y-6 sm:w-[400px]">
      <div className="flex flex-col space-y-2 text-center">
        <icons.logo className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">Sign Up</h1>
        <p className="text-sm max-w-xs mx-auto">
          By Continuing , you are setting up a breadit account and agree to our
          user agreement and privacy policy
        </p>

        {/* signin form */}
        <UserFormAuth />
        <p className="px-8 text-center text-sm text-zinc-700">
          ALready a Breadditor?
          <Link
            href="/sign-in"
            className="hover:text-zinc-800 text-sm underline-offset-4"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
//nextjs app routing
