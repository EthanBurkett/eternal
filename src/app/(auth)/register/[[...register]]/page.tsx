"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { OAuthStrategy } from "@clerk/types";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";

export default function RegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();

  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ message: string }[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const signInWith = (strategy: OAuthStrategy) => {
    return signUp?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/register/sso-callback",
      redirectUrlComplete: "/",
    });
  };

  async function handleSignInWith(strategy: OAuthStrategy) {
    if (!signIn || !signUp) return null;

    const userExistsButNeedsToSignIn =
      signUp.verifications.externalAccount.status === "transferable" &&
      signUp.verifications.externalAccount.error?.code ===
        "external_account_exists";

    if (userExistsButNeedsToSignIn) {
      const res = await signIn.create({ transfer: true });

      if (res.status === "complete") {
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
        await setActive({
          session: res.createdSessionId,
        });
      }
    } else {
      signInWith(strategy);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    if (!isLoaded) {
      setErrors([
        { message: "Authentication service not ready. Please try again." },
      ]);
      setIsLoading(false);
      return;
    }

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setErrors([{ message: "Passwords do not match" }]);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (result.status === "complete") {
        // If sign up is immediately complete (shouldn't happen with email verification)
        await setActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        // Normal flow - prepare email verification
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });
        setVerifying(true);
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.message ||
        "An error occurred during registration. Please try again.";
      setErrors([{ message: errorMessage }]);
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsLoading(true);

    if (!isLoaded) {
      setErrors([
        { message: "Authentication service not ready. Please try again." },
      ]);
      setIsLoading(false);
      return;
    }

    if (code.length !== 6) {
      setErrors([{ message: "Please enter a valid 6-digit code" }]);
      setIsLoading(false);
      return;
    }

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push("/");
      } else {
        setErrors([{ message: "Verification failed. Please try again." }]);
        console.error("Verification failed:", signUpAttempt);
      }
    } catch (err: any) {
      const errorMessage =
        err.errors?.[0]?.message ||
        "An error occurred during verification. Please try again.";
      setErrors([{ message: errorMessage }]);
      console.error("Verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRegistration = () => {
    setVerifying(false);
    setErrors([]);
    setCode("");
  };

  if (verifying) {
    return (
      <div className="!min-h-screen !max-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
          <h2 className="mt-6 text-center text-2xl font-bold text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-center text-sm text-white/80">
            We've sent a verification code to {formData.email}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-neutral-900 border-2 border-white/10 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {errors.length > 0 && (
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
                    <p className="text-sm text-red-700">{errors[0].message}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-white text-center"
                >
                  Enter verification code
                </label>
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup className="gap-2">
                      {Array(6)
                        .fill(0)
                        .map((_, index) => (
                          <InputOTPSlot
                            key={index}
                            index={index}
                            className={`w-12 h-12 text-2xl border rounded-md  text-white ${
                              errors.length > 0
                                ? "border-red-500"
                                : "border-white/10"
                            }`}
                          />
                        ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={code.length !== 6 || isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-700 ${
                    code.length !== 6 || isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isLoading ? "Verifying..." : "Verify Email"}
                </button>
              </div>
              <div id="clerk-captcha"></div>
            </form>

            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                onClick={handleBackToRegistration}
                disabled={isLoading}
                className={`font-medium text-white hover:text-white transition-all px-4 cursor-pointer rounded-md py-2 bg-neutral-800 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-700 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Back to registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="clerk-captcha" className="hidden"></div>
      <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-white">
            Or{" "}
            <Link
              href="/login"
              className="font-medium text-neutral-400 hover:text-neutral-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-neutral-900 border-2 border-white/10 py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
            {errors.length > 0 && (
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
                    <p className="text-sm text-red-700">{errors[0].message}</p>
                  </div>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-white"
                  >
                    First name
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm bg-neutral-200"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-white"
                  >
                    Last name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm bg-neutral-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white"
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
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm bg-neutral-200"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-white"
                >
                  Confirm password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500 sm:text-sm bg-neutral-200"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="cta-button !shadow-none disabled:opacity-75 disabled:cursor-not-allowed w-full !rounded-md transition-transform"
                >
                  {isLoading ? "Registering..." : "Register"}
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
                  Sign up with Google
                </div>
              </div>
              <div id="clerk-captcha"></div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
