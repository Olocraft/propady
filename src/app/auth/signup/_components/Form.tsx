"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { validateFields } from "@/lib/utils";

export default function SignUpForm() {
  const router = useRouter();

  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });
  const [loading, setLoading] = useState(false);

  const { email, password, confirmPassword, fullName } = signUpData;

  const isDisabled = !email || !password || !confirmPassword || !fullName;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignUpData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    return;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { isEmpty, passwordsMatch } = validateFields(signUpData);

    if (isEmpty) {
      toast.error("All fields must be filled");
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      toast.error("passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post<{ success: boolean; message: string }>(
        "/api/auth/signin",
        signUpData
      );
      const response = data.success ? "success" : "error";
      toast[response](data.message);
    } catch (error) {
      toast.error("Internal error, try again");
      console.error("Sign in error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="absolute inset-0 z-0 ">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-propady-purple/20 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-propady-mint/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4 sm:px-0"
      >
        <Card className="glass-morphism border-white/10">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className=" w-fit mx-auto text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>

          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">
              Welcome to Propady
            </CardTitle>
            <CardDescription className="text-center text-white/70">
              Create an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  name="fullName"
                  value={fullName}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-propady-purple hover:bg-propady-purple-light"
                disabled={loading || isDisabled}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-white/70">
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
