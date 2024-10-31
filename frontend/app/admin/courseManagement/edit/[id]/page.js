"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
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
  sub_category: z.string().optional(),
  banner: z.instanceof(File).optional(),
});

const EditCourse = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
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

  const [banner, setBanner] = useState(null);
  const [initialData, setInitialData] = useState({
    title: "",
    status: "",
    category: "",
    sub_category: "",
    banner: "",
  });
  const selectedCategory = watch("category");

  useEffect(() => {
    console.log(id);
    const fetchCourseData = async () => {
      const token = localStorage.getItem("auth_token");
      try {
        const response = await axios.get(
          `http://localhost:8000/api/courses/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInitialData(response.data);
        console.log("Course data:", response.data);

        // Populate form with existing course data
        setValue("title", response.data.title);
        setValue("status", response.data.status);
        setValue("category", response.data.category);
        setValue("sub_category", response.data.sub_category);
        setBanner(response.data.banner);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [id, setValue]);

  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      console.log("Initial data updated:", initialData);
    }
  }, [initialData]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("status", data.status);
    formData.append("category", data.category);
    formData.append("sub_category", data.sub_category);

    // Append banner only if it's a new File instance
    if (banner instanceof File) {
      formData.append("banner", banner);
    }

    const token = localStorage.getItem("auth_token");
    try {
      const response = await axios.post(
        `http://localhost:8000/api/courses/${id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Course updated:", response.data);
      router.push("/admin/courseManagement");
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error);
    }
  };

  const handleFileUpload = (file) => {
    setBanner(file);
    setValue("banner", file);
    clearErrors("banner");
  };

  const categoryOptions = ["Medical", "Non-Medical"];
  const subCategoryOptions = {
    Medical: ["Doctor", "Pharmacy"],
    "Non-Medical": ["IT Staff", "Accounting Staff", "Manager"],
  };

  return (
    <Card className="w-[750px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>Edit Course</CardTitle>
        <CardDescription>Update details for the course.</CardDescription>
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
                value={initialData.status}
                onValueChange={(value) => {
                  setValue("status", value);
                  setInitialData({ ...initialData, status: value });
                  clearErrors("status");
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
                value={initialData.category}
                onValueChange={(value) => {
                  setValue("category", value);
                  setValue("sub_category", "");
                  setInitialData({
                    ...initialData,
                    category: value,
                    sub_category: "",
                  });
                  clearErrors("category");
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
            {selectedCategory && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="sub_category">Sub-Category</Label>
                <Select
                  value={initialData.sub_category}
                  onValueChange={(value) => {
                    setValue("sub_category", value);
                    setInitialData({ ...initialData, sub_category: value });
                  }}
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
              <FileUpload
                initialFile={`http://localhost:8000/storage/${initialData.banner}`}
                onFilesUploaded={handleFileUpload}
              />
              {errors.banner && (
                <span className="text-red-500">{errors.banner.message}</span>
              )}
            </div>
          </div>
          <CardFooter className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default EditCourse;
