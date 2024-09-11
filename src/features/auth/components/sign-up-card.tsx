import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { SignInFlow } from "../types";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <Card className="h-full w-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Sign up to continue</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5">
          <Input
            required
            value={email}
            type="email"
            disabled={false}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            required
            value={password}
            type="password"
            disabled={false}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            required
            value={confirmPassword}
            type="password"
            disabled={false}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" className="w-full" size="lg" disabled={false}>
            Continue
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-y-2.5">
          <Button
            size="lg"
            disabled={false}
            variant="outline"
            onClick={() => {}}
            className="relative w-full"
          >
            <FcGoogle className="absolute left-3 top-2.5 size-5" />
            Continue with Google
          </Button>
          <Button
            size="lg"
            disabled={false}
            variant="outline"
            onClick={() => {}}
            className="relative w-full"
          >
            <FaGithub className="absolute left-3 top-2.5 size-5" />
            Continue with GitHub
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            onClick={() => setState("signIn")}
            className="cursor-pointer text-sky-700 hover:underline"
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
