import Link from "next/link";
import Image from "next/image";

export default function Login() {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      {/* Left Section: Image */}
      <div className="relative hidden h-full bg-cover bg-center md:block md:w-1/2">
        <Image
          src="https://picsum.photos/800/600"
          alt="Placeholder"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      {/* Right Section: Login Form */}
      <div className="flex h-full w-full items-center justify-center bg-gray-50 md:w-1/2">
        <div className="w-full max-w-md rounded-md bg-white px-8 py-6 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
            Login
          </h2>
          <form>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring focus:ring-blue-300"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
