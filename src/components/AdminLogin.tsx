
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsLoading(true);
    // For demo purposes, hardcoded password
    // In production, use proper authentication
    const adminPassword = "operative2025";
    
    setTimeout(() => {
      if (data.password === adminPassword) {
        // Store authentication status in session storage
        sessionStorage.setItem("adminAuthenticated", "true");
        toast.success("Login successful");
        navigate("/admin/dashboard");
      } else {
        toast.error("Incorrect password");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>Enter your password to access admin controls</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4 text-gray-500" />
                          <Input 
                            type="password" 
                            placeholder="Enter admin password" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Authenticating..." : "Login"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
