"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ClerkAPIError, OAuthStrategy } from "@clerk/types";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signUp } = useSignUp();
  const [errors, setErrors] = useState<ClerkAPIError[]>();
  const router = useRouter();

  const signInWith = (strategy: OAuthStrategy) => {
    return signUp?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/register/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  async function handleSignInWith(strategy: OAuthStrategy) {
    if (!signIn || !signUp) return null;
    setIsLoading(true);

    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === "transferable" &&
      signUp.verifications.externalAccount.error?.code ===
        "external_account_exists";

    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true });

      if (res.status === "complete") {
        setIsLoading(false);
        await setActive({
          session: res.createdSessionId,
        });
      }
    }

    const userNeedsToBeCreated =
      signIn.firstFactorVerification.status === "transferable";

    if (userNeedsToBeCreated) {
      const res = await signUp.create({
        transfer: true,
      });

      if (res.status === "complete") {
        setIsLoading(false);
        await setActive({
          session: res.createdSessionId,
        });
      }
    } else {
      signInWith(strategy);
    }
    setIsLoading(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      if (err.errors) setErrors(err.errors);
      else console.error("Error:", JSON.stringify(err, null, 2));
    }
  };

  return (
    <div className="min-h-screen bg-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <Image
            src="/media/logo_solid_white.png"
            alt="Logo"
            width={500}
            height={500}
            className="w-full h-auto"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/register"
            className="font-medium text-neutral-400 hover:text-neutral-300"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900 border-2 border-white/10 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          {errors && errors.length > 0 && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors?.[0].message}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-400"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm bg-neutral-200"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-400"
                >
                  Password
                </label>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-neutral-400 hover:text-neutral-300"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm bg-neutral-200"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                // className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-600 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 ${
                //   isLoading ? "opacity-75 cursor-not-allowed" : ""
                // }`}
                className="cta-button !shadow-none disabled:opacity-75 disabled:cursor-not-allowed w-full !rounded-md transition-transform"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-neutral-900 text-white">OR</span>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div
                onClick={() => {
                  setIsLoading(true);
                  handleSignInWith("oauth_google");
                }}
                className={`cursor-pointer flex justify-center items-center gap-6 w-full rounded-md bg-transparent border-2 border-white px-4 py-2 text-white font-medium hover:text-black hover:bg-white transition-colors ${
                  isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                <FaGoogle />
                Sign in with Google
              </div>
            </div>
          </form>
        </div>
      </div>
      <div id="clerk-captcha"></div>
    </div>
  );
}
