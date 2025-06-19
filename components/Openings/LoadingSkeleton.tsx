import { Skeleton } from "../ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="flex h-full w-full flex-col px-8 py-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-96 bg-gray-300" />
            <Skeleton className="h-4 w-64 bg-gray-300" />
          </div>
          <Skeleton className="h-10 w-32 bg-gray-300" />{" "}
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64 bg-gray-300" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 bg-gray-300" />
            <Skeleton className="h-10 w-24 bg-gray-300" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 border-b p-4">
            {[
              "Nombre",
              "Correo electrónico",
              "Cargo",
              "Rol asignado",
              "Estado",
              "Candidatos",
              "Stakeholders",
              "prioridad",
              "",
            ].map((_, i) => (
              <Skeleton
                key={i}
                className="h-4"
                style={{ width: i === 5 ? "40px" : "160px" }}
              />
            ))}
          </div>

          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b p-4">
              <Skeleton className="h-4 w-40 bg-gray-300" />
              <Skeleton className="h-4 w-40 bg-gray-300" />
              <Skeleton className="h-4 w-40 bg-gray-300" />
              <Skeleton className="h-4 w-40 bg-gray-300" />
              <Skeleton className="h-4 w-40 bg-gray-300" />
              <Skeleton className="h-4 w-40 bg-gray-300" />
              <Skeleton className="h-4 w-40 bg-gray-300" />
              <Skeleton className="h-6 w-16 rounded-full bg-gray-300" />{" "}
              <Skeleton className="ml-auto h-4 w-4 bg-gray-300" />{" "}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
