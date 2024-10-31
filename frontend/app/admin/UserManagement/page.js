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

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  console.log(users);
  const token = localStorage.getItem("auth_token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log(response.data);
        setUsers(response.data); // Set user data
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token) {
      // Ensure token exists before making the API call
      fetchUsers();
    } else {
      console.error("No token found. Please log in.");
    }
  }, [token]); // Added token as a dependency

  return (
    <>
      <div className="mb-4">
        <Link href="/admin/UserManagement/create">
          <Button className="bg-jecBlue hover:bg-jecGreen">Tambah User</Button>
        </Link>
      </div>
      <Table>
        <TableHeader className="bg-blue-100">
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length > 0 ? (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(user.updated_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Link href={`/admin/UserManagement/edit/${user.id}`}>
                    <Button variant="outline" className="mr-2">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button variant="outline" color="red">
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" className="text-center">
                No user data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
