"use client";

import React from "react";
import {
  ClerkProvider as BaseClerkProvider,
  SignInButton as BaseSignInButton,
  SignUpButton as BaseSignUpButton,
  UserButton as BaseUserButton,
  SignedIn,
  SignedOut,
  useUser,
  useClerk,
  useAuth,
  SignIn,
  SignUp,
} from "@clerk/nextjs";

export {
  BaseClerkProvider as ClerkProvider,
  BaseSignInButton as SignInButton,
  BaseSignUpButton as SignUpButton,
  BaseUserButton as UserButton,
  SignedIn,
  SignedOut,
  useUser,
  useClerk,
  useAuth,
  SignIn,
  SignUp,
};

export function Show({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: React.ReactNode;
}) {
  if (when === "signed-in") {
    return <SignedIn>{children}</SignedIn>;
  }
  return <SignedOut>{children}</SignedOut>;
}
