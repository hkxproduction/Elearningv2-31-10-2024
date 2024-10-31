"use client";

import { Trash, Edit } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    axios
      .get("http://localhost:8000/api/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const handleDelete = (id) => {
    const token = localStorage.getItem("auth_token");
    axios
      .delete(`http://localhost:8000/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setCourses(courses.filter((course) => course.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting course:", error);
      });
  };

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/courseManagement/create">
          <Button className="bg-jecBlue hover:bg-jecGreen">
            Tambah Course
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader className="bg-blue-100">
          <TableRow>
            <TableHead className="w-[70px]">No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sub-Category</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <TableRow key={course.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{course.title}</TableCell>
                <TableCell>{course.status}</TableCell>
                <TableCell>{course.category}</TableCell>
                <TableCell>{course.sub_category}</TableCell>
                <TableCell>
                  {new Date(course.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(course.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/courseManagement/edit/${course.id}`}>
                    <Button variant="outline">
                      <Edit />
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(course.id)}
                    className="ml-2"
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="8" className="text-center">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
