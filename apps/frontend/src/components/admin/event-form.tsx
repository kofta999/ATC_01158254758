import React, { useState, useEffect } from "react";
import { Card } from "@/components/card";
import { PrimaryButton } from "@/components/primary-button";
import { Link } from "@tanstack/react-router";

// Define the shape of the form data. This should align with CreateEventDTO and UpdateEventDTO.
// For simplicity, let's assume a combined type or use a base type.
// Your CreateEventSchema and UpdateEventSchema from the backend would be good references.
export interface EventFormData {
  eventName: string;
  description: string;
  category: string;
  date: string; // Expecting YYYY-MM-DD format for date input
  venue: string;
  price: number;
  image: string; // URL or placeholder
  imageFile?: File;
}

interface EventFormProps {
  initialData?: Partial<EventFormData>; // For editing
  onSubmit: (data: EventFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitButtonText?: string;
  formTitle: string;
  submissionError?: string | null; // Prop to receive and display errors from parent
}

export const EventForm: React.FC<EventFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  submissionError, // Receive submission error
  submitButtonText = "Submit",
  formTitle,
}) => {
  const [formData, setFormData] = useState<EventFormData>(() => ({
    eventName: initialData?.eventName || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    date: initialData?.date || "",
    venue: initialData?.venue || "",
    price: initialData?.price || 0,
    image: initialData?.image || "",
  }));

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [_, setSubmitError] = useState<string | null>(null);

  // Update form if initialData changes (e.g., when data loads for an edit form)
  useEffect(() => {
    if (initialData) {
      setFormData({
        eventName: initialData.eventName || "",
        description: initialData.description || "",
        category: initialData.category || "",
        date: initialData.date || "", // Ensure date format is YYYY-MM-DD
        venue: initialData.venue || "",
        price: initialData.price || 0,
        image: initialData?.image || "",
      });
      setImageFile(null); // Clear file when initial data loads
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setImageFile(files[0]);
      } else {
        setImageFile(null);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      if (imageFile) {
        await onSubmit({ ...formData, imageFile });
      } else {
        await onSubmit({ ...formData });
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      setSubmitError(error.message || "An error occurred. Please try again.");
    }
  };

  // Helper for input props to reduce repetition
  const inputProps = (
    name: keyof EventFormData,
    type: string = "text",
    placeholder?: string,
    required: boolean = true,
  ) => ({
    id: name,
    name: name,
    type: type,
    value: String(formData[name]), // Ensure value is string for input, number for price will be parsed
    onChange: handleChange,
    className:
      "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none",
    placeholder:
      placeholder ||
      name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, " $1"), // Auto placeholder
    required: required,
  });

  // Helper for file input props
  const fileInputProps = (name: keyof EventFormData) => ({
    id: name,
    name: name,
    type: "file" as "file", // Explicitly type as file
    onChange: handleChange,
    className:
      "w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20",
  });

  return (
    <Card className="max-w-2xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-text">
        {formTitle}
      </h1>
      {/* Display submission error passed from parent */}
      {submissionError && (
        <div className="mb-4 p-3 bg-danger/10 border border-danger text-danger rounded-lg text-sm">
          {submissionError}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="eventName"
            className="block text-sm font-medium text-text mb-1"
          >
            Event Name
          </label>
          <input
            {...inputProps("eventName", "text", "e.g., Summer Music Festival")}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-text mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Describe the event..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-text mb-1"
            >
              Category
            </label>
            <input
              {...inputProps("category", "text", "e.g., Music, Technology")}
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-text mb-1"
            >
              Date
            </label>
            <input {...inputProps("date", "date")} />{" "}
            {/* HTML5 date picker expects YYYY-MM-DD */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="venue"
              className="block text-sm font-medium text-text mb-1"
            >
              Venue
            </label>
            <input {...inputProps("venue", "text", "e.g., Central Park")} />
          </div>
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-text mb-1"
            >
              Price ($)
            </label>
            <input
              {...inputProps("price", "number", "e.g., 50")}
              value={formData.price}
            />{" "}
            {/* Keep value as number for type="number" */}
          </div>
        </div>

        <div>
          <label
            htmlFor="imageFile"
            className="block text-sm font-medium text-text mb-1"
          >
            Image
          </label>
          <input
            {...fileInputProps("imageFile")}
            accept="image/*" // Accept image files
          />
          {imageFile && (
            <p className="mt-1 text-sm text-gray-600">
              Selected file: {imageFile.name}
            </p>
          )}
          {/* Display existing image if in initialData and no file selected */}
          {!imageFile && initialData?.image && (
            <div className="mt-2">
              <img
                src={initialData.image}
                alt="Current event image"
                className="max-h-40 rounded-lg object-cover"
              />
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center gap-4">
          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="text-base px-6"
          >
            {isSubmitting ? "Submitting..." : submitButtonText}
          </PrimaryButton>
          <Link
            to="/admin/dashboard"
            className="text-sm text-muted hover:text-primaryDark"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Card>
  );
};
