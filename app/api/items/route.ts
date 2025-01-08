import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;
  const data = await fetch("http://example.com/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await data.json();
  return Response.json(json);
}
