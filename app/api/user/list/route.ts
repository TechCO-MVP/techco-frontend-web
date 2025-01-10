import { NextResponse } from "next/server";
import { User } from "@/types";
const users: User[] = [
  {
    name: "Carlos Hernandez",
    email: "carloshernandez@techo.pe",
    position: "VP operaciones",
    role: "Super Administrador",
    status: "Activo",
  },
  {
    name: "Maria Lopez",
    email: "marialopez@techo.pe",
    position: "Gerente Financiero",
    role: "Administrador",
    status: "Activo",
  },
  {
    name: "Juan Perez",
    email: "juanperez@techo.pe",
    position: "Jefe de Proyectos",
    role: "Administrador",
    status: "Activo",
  },
  {
    name: "Lucia Gomez",
    email: "luciagomez@techo.pe",
    position: "Coordinadora de Ventas",
    role: "Administrador",
    status: "Inactivo",
  },
  {
    name: "Pedro Martinez",
    email: "pedromartinez@techo.pe",
    position: "Analista de Datos",
    role: "Super Administrador",
    status: "Activo",
  },
  {
    name: "Ana Torres",
    email: "anatorres@techo.pe",
    position: "Asistente Administrativo",
    role: "Super Administrador",
    status: "Activo",
  },
];
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // const cookieStore = await cookies();
  // const token = cookieStore.get("accessToken")?.value;
  // const data = await fetch("http://example.com/users", {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // });
  // const json = await data.json();
  return NextResponse.json(users);
}
