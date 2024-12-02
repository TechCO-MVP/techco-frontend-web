"use client";
import { useAppSelector } from "@/lib/store/hooks";
import { selectSignUpState } from "@/lib/store/features/auth/sign-up-slice";

export default function CodePage() {
  const signUpState = useAppSelector(selectSignUpState);
  console.log(signUpState.email);
  return <h1>CODE</h1>;
}
