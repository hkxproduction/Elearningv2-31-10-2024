"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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

const CreateCourse = () => {
  const router = useRouter();
  const [course, setCourse] = useState({
    title: "",
    student: "",
    status: "",
    categories: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/api/courses", course)
      .then((response) => {
        console.log("Course created:", response.data);
        router.push("/dashboard/courseManagement");
      })
      .catch((error) => {
        console.error("Error creating course:", error);
      });
  };

  const StudentOptions = [
    { value: "Docter" },
    { value: "Manager" },
    { value: "Staff " },
    { value: "Head of Division" },
  ];
  const statusOptions = [
    { value: "Draft" },
    { value: "Published" },
    { value: "Expired" },
  ];
  const CategoriesOptions = [
    { value: "General" },
    { value: "Docter Education" },
    { value: "Training Staff" },
    { value: "Training Intership" },
  ];

  return (
    <Card className="w-[350px] mx-auto mt-8">
      <CardHeader>
        <CardTitle>Tambah Course</CardTitle>
        <CardDescription>
          Tambahkan course baru untuk materi pembelajaran.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                placeholder="Title"
                value={course.title}
                onChange={(e) =>
                  setCourse({ ...course, title: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="student">Student</Label>
              <Select
                onValueChange={(value) =>
                  setCourse({ ...course, student: value })
                }
              >
                <SelectTrigger id="student">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {StudentOptions.map((student) => (
                    <SelectItem key={student.value} value={student.value}>
                      {student.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) =>
                  setCourse({ ...course, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="status">Categories</Label>
              <Select
                onValueChange={(value) =>
                  setCourse({ ...course, categories: value })
                }
              >
                <SelectTrigger id="categories">
                  <SelectValue placeholder="Select categories" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {CategoriesOptions.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateCourse;
