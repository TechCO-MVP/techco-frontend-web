"use client";
import { COUNTRIES } from "@/lib/data/countries";
import { Checkbox } from "@/components/ui/checkbox";
import { useActionState } from "react";
import { getDictionary } from "@/get-dictionary";
import * as actions from "@/actions";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  setSignUpState,
  selectSignUpState,
} from "@/lib/store/features/auth/sign-up-slice";

export function SignUpPage({
  dictionary,
}: {
  readonly dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) {
  // We bind the dictionary to the action to recive it as param
  // See: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#passing-additional-arguments

  const actionWithDictionary = actions.signUp.bind(null, dictionary);
  const [formState, action] = useActionState(actionWithDictionary, {
    errors: {},
  });

  const dispatch = useAppDispatch();
  // Get state from redux
  // Will also address this issue: https://github.com/vercel/next.js/issues/72949
  const signUpState = useAppSelector(selectSignUpState);

  return (
    <div className="w-full max-w-md rounded-md px-8 py-6">
      <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
        Sign Up
      </h2>
      <form action={action}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            e-mail address
          </label>
          <input
            onChange={(e) =>
              dispatch(
                setSignUpState({ ...signUpState, email: e.target.value }),
              )
            }
            type="email"
            id="email"
            name="email"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="youremail@yourdomain.com"
          />
          <div className="bg-red-400">{formState.errors.email?.join(", ")}</div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-600"
          >
            Company name
          </label>
          <input
            type="test"
            id="company"
            name="company"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Name of your company"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-600"
          >
            Country
          </label>
          <select
            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-300"
            name="country"
            id="country"
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.name}>
                {country.emoji} {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4 flex justify-start gap-2">
          <Checkbox
            name="terms"
            className="border-gray-600 data-[state=checked]:bg-gray-600"
            id="terms"
          />
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring focus:ring-blue-300"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
