"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUpload from "@/components/ui/FileUpload";

// Define the Zod schema for validation
const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.string().min(1, "Status is required"),
  category: z.string().min(1, "Category is required"),
  sub_category: z.string().optional(), // Make sub_category optional
  banner: z.instanceof(File).refine((file) => file !== null, {
    message: "File upload is required",
  }), // Ensure a file is uploaded
});

const CreateCourse = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(courseSchema),
  });
  const [banner, setBanner] = useState(null); // Handle file upload separately

  // Use watch to get the current value of the category
  const selectedCategory = watch("category");

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("status", data.status);
    formData.append("category", data.category);
    formData.append("sub_category", data.sub_category);
    if (banner) formData.append("banner", banner); // Use the file object

    const token = localStorage.getItem("auth_token");
    axios
      .post("http://localhost:8000/api/courses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Course created:", response.data);
        router.push("/admin/courseManagement");
      })
      .catch((error) => {
        console.error("Error creating course:", error);
      });
  };

  const handleFileUpload = (file) => {
    setBanner(file); // Set the file object
    setValue("banner", file); // Set the value in the form
    clearErrors("banner"); // Clear the error for banner if a file is uploaded
  };

  const categoryOptions = ["Medical", "Non-Medical"];
  const subCategoryOptions = {
    Medical: ["Doctor", "Pharmacy"],
    "Non-Medical": ["IT Staff", "Accounting Staff", "Manager"],
  };

  return (
    <Card className="w-[750px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>Create Course</CardTitle>
        <CardDescription>Enter details for the new course.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Title"
                {...register("title")}
              />
              {errors.title && (
                <span className="text-red-500">{errors.title.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => {
                  setValue("status", value); // Set the value directly
                  clearErrors("status"); // Clear the error for status
                }}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <span className="text-red-500">{errors.status.message}</span>
              )}
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(value) => {
                  setValue("category", value); // Set the category value
                  setValue("sub_category", ""); // Reset sub-category
                  clearErrors("category"); // Clear the error for category
                }}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <span className="text-red-500">{errors.category.message}</span>
              )}
            </div>
            {/* Render sub-category based on the selected category */}
            {selectedCategory && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="sub_category">Sub-Category</Label>
                <Select
                  onValueChange={(value) => setValue("sub_category", value)} // Set the sub-category value
                >
                  <SelectTrigger id="sub_category">
                    <SelectValue placeholder="Select sub-category" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {subCategoryOptions[selectedCategory]?.map(
                      (subCategory) => (
                        <SelectItem key={subCategory} value={subCategory}>
                          {subCategory}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="banner">Upload Banner</Label>
              <FileUpload onFilesUploaded={handleFileUpload} />
              {errors.banner && (
                <span className="text-red-500">{errors.banner.message}</span>
              )}
            </div>
          </div>
          <CardFooter className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateCourse;
