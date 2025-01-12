import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FileDropzone } from "@/components/FileDropzone/FileDropzone";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("FileDropzone", () => {
  const mockOnImageProcessed = vi.fn();
  const dragLabel = "Arrastra tu imagen aqui";
  const selectLabel = "Seleccionar una imagen de tu computador";
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly", () => {
    render(
      <FileDropzone
        dragImageLabel={dragLabel}
        selectImageLabel={selectLabel}
        onImageProcessed={mockOnImageProcessed}
      />,
    );

    // Check for drag-and-drop area
    expect(screen.getByText(dragLabel)).toBeInTheDocument();
    // Check for button
    expect(
      screen.getByRole("button", {
        name: selectLabel,
      }),
    ).toBeInTheDocument();
  });

  it("opens the file input when the button is clicked", () => {
    render(
      <FileDropzone
        dragImageLabel={dragLabel}
        selectImageLabel={selectLabel}
        onImageProcessed={mockOnImageProcessed}
      />,
    );

    const fileInput = screen.getByTestId("hidden-file-input");
    const button = screen.getByRole("button", {
      name: selectLabel,
    });

    vi.spyOn(fileInput, "click");

    fireEvent.click(button);

    expect(fileInput.click).toHaveBeenCalledTimes(1);
  });

  it("processes an image file and calls onImageProcessed", async () => {
    render(
      <FileDropzone
        dragImageLabel={dragLabel}
        selectImageLabel={selectLabel}
        onImageProcessed={mockOnImageProcessed}
      />,
    );

    const fileInput = screen.getByTestId("hidden-file-input");

    const imageFile = new File(["dummy-content"], "test.png", {
      type: "image/png",
    });

    fireEvent.change(fileInput, { target: { files: [imageFile] } });

    await waitFor(() => {
      expect(mockOnImageProcessed).toHaveBeenCalledTimes(1);
      expect(mockOnImageProcessed).toHaveBeenCalledWith(
        expect.stringContaining("data:image/png;base64"),
      );
    });
  });

  it("shows an error message when a non-image file is uploaded", async () => {
    render(
      <FileDropzone
        dragImageLabel={dragLabel}
        selectImageLabel={selectLabel}
        onImageProcessed={mockOnImageProcessed}
      />,
    );

    const fileInput = screen.getByTestId("hidden-file-input");

    const textFile = new File(["dummy-content"], "test.txt", {
      type: "text/plain",
    });

    fireEvent.change(fileInput, { target: { files: [textFile] } });

    await waitFor(() => {
      expect(
        screen.getByText("Only image files are allowed."),
      ).toBeInTheDocument();
    });

    expect(mockOnImageProcessed).not.toHaveBeenCalled();
  });

  it("handles drag-and-drop for image files", async () => {
    render(
      <FileDropzone
        dragImageLabel={dragLabel}
        selectImageLabel={selectLabel}
        onImageProcessed={mockOnImageProcessed}
      />,
    );

    const dropZone = screen.getByText(dragLabel);

    const imageFile = new File(["dummy-content"], "test.png", {
      type: "image/png",
    });

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [imageFile],
      },
    });

    await waitFor(() => {
      expect(mockOnImageProcessed).toHaveBeenCalledTimes(1);
      expect(mockOnImageProcessed).toHaveBeenCalledWith(
        expect.stringContaining("data:image/png;base64"),
      );
    });
  });

  it("shows an error message for non-image files dropped", async () => {
    render(
      <FileDropzone
        dragImageLabel={dragLabel}
        selectImageLabel={selectLabel}
        onImageProcessed={mockOnImageProcessed}
      />,
    );

    const dropZone = screen.getByText(dragLabel);

    const textFile = new File(["dummy-content"], "test.txt", {
      type: "text/plain",
    });

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [textFile],
      },
    });

    await waitFor(() => {
      expect(
        screen.getByText("Only image files are allowed."),
      ).toBeInTheDocument();
    });

    expect(mockOnImageProcessed).not.toHaveBeenCalled();
  });
});
