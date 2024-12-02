import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SignUpLayoutProps {
  children: React.ReactNode;
}

export default function SignUpLayout(props: Readonly<SignUpLayoutProps>) {
  const { children } = props;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <div className="relative hidden h-full bg-cover bg-center md:block md:w-1/2">
        <Image
          src="https://picsum.photos/800/600"
          alt="Placeholder"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <div className="flex h-full w-full flex-col bg-gray-50 md:w-1/2">
        <header className="w-full p-4">
          <nav>
            <ul className="flex justify-end space-x-4">
              <li>
                <Link href="/signup" className="text-blue-600 hover:underline">
                  <Button variant="link">Sign Up</Button>
                </Link>
              </li>
              <li>
                <Link href="/signin" className="text-blue-600 hover:underline">
                  <Button variant="link">Sign In</Button>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>
      </div>
    </div>
  );
}
