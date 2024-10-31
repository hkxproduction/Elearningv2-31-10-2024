"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardFooter, CardContent } from "@/components/ui/card";
import Image from "next/image";

const Dashboard = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {courses.map((course) => (
        <Card key={course.id} className="max-w-sm border rounded-lg shadow-md">
          <CardContent className="p-4">
            {course.banner ? (
              <Image
                src={`http://localhost:8000/storage/${course.banner}`}
                alt={course.title}
                width={300}
                height={150}
                className="rounded-md w-full h-auto"
              />
            ) : (
              <p className="text-center">No Banner Available</p>
            )}
            <h2 className="text-lg font-semibold mt-4">{course.title}</h2>
            {/* Badge for category */}
          </CardContent>
          <CardFooter className="border-t">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center">
                {course.category && (
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Dashboard;
