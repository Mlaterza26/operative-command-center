
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  slack: string;
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<Omit<User, "id">>({
    name: "",
    email: "michael.laterza@futurenet.com",
    role: "",
    department: "",
    slack: "",
  });
  
  // Load users from localStorage on component mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Generate sample users if none exist
      const sampleUsers = Array.from({ length: 25 }, (_, i) => ({
        id: `user-${i + 1}`,
        name: `ML ${i + 1}`,
        email: "michael.laterza@futurenet.com",
        role: i % 3 === 0 ? "Admin" : i % 3 === 1 ? "Editor" : "Viewer",
        department: i % 4 === 0 ? "Finance" : i % 4 === 1 ? "Marketing" : i % 4 === 2 ? "Sales" : "Operations",
        slack: `@ml${i + 1}`,
      }));
      
      setUsers(sampleUsers);
      localStorage.setItem("users", JSON.stringify(sampleUsers));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  // Add a new user
  const addUser = () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Name and email are required");
      return;
    }
    
    const updatedUsers = [
      ...users,
      {
        id: `user-${Date.now()}`,
        ...newUser,
      },
    ];
    
    setUsers(updatedUsers);
    setNewUser({
      name: "",
      email: "michael.laterza@futurenet.com",
      role: "",
      department: "",
      slack: "",
    });
    
    toast.success("User added successfully");
  };

  // Delete a user
  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    toast.success("User deleted successfully");
  };

  // Export users to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Email", "Role", "Department", "Slack"];
    const csvContent = [
      headers.join(","),
      ...users.map(user => [user.name, user.email, user.role, user.department, user.slack].join(",")),
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "users.csv");
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Users exported to CSV");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">User Management</h3>
        <Button onClick={exportToCSV}>Export to CSV</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Input
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <Input
          placeholder="Role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        />
        <Input
          placeholder="Department"
          value={newUser.department}
          onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
        />
        <div className="flex gap-2">
          <Input
            placeholder="Slack"
            value={newUser.slack}
            onChange={(e) => setNewUser({ ...newUser, slack: e.target.value })}
          />
          <Button onClick={addUser}>Add</Button>
        </div>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Slack</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.slack}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => deleteUser(user.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
