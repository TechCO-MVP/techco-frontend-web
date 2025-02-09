import { NextResponse } from "next/server";
import { Position } from "@/types";

export async function GET() {
  const positions: Position[] = [
    {
      id: 1,
      status: "Activa",
      name: "Lead Arquitecto",
      created_at: new Date("2024-02-01"),
      candidates: 100,
      priority: "Alta",
      responsible: "Andres Sanchez",
      recruiter: "Jessica Trujillo",
    },
    {
      id: 2,
      status: "Inactiva",
      name: "Senior Backend Developer",
      created_at: new Date("2024-01-15"),
      candidates: 50,
      priority: "Media",
      responsible: "Carlos Rodríguez",
      recruiter: "Ana López",
    },
    {
      id: 3,
      status: "Activa",
      name: "Product Manager",
      created_at: new Date("2023-12-20"),
      candidates: 30,
      priority: "Alta",
      responsible: "Mariana Pérez",
      recruiter: "Fernando Gómez",
    },
    {
      id: 4,
      status: "Activa",
      name: "UX/UI Designer",
      created_at: new Date("2024-01-25"),
      candidates: 75,
      priority: "Baja",
      responsible: "Sofía Martínez",
      recruiter: "Daniela Ortega",
    },
    {
      id: 5,
      status: "Cancelada",
      name: "DevOps Engineer",
      created_at: new Date("2023-11-10"),
      candidates: 40,
      priority: "Media",
      responsible: "Ricardo Fernández",
      recruiter: "Gabriel Herrera",
    },
  ];

  return NextResponse.json(positions);
}
