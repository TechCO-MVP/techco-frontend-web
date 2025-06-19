import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface UploadPdfInput {
  file: File;
  hiringProcessId: string;
  assistantName: string;
  message: string;
}
interface UploadPdfResponse {
  message: string;
  process_id: string;
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
}

export const useUploadPdf = (
  options?: UseMutationOptions<UploadPdfResponse, Error, UploadPdfInput>,
) => {
  return useMutation({
    mutationFn: async ({
      file,
      hiringProcessId,
      assistantName,
      message,
    }: {
      file: File;
      hiringProcessId: string;
      assistantName: string;
      message: string;
    }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("hiring_process_id", hiringProcessId);
      formData.append("assistant_name", assistantName);
      formData.append("message", message);

      const res = await fetch("/api/hiring-process/send-file-to-assistant", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Upload failed");
      }

      return await res.json();
    },
    ...options,
  });
};
