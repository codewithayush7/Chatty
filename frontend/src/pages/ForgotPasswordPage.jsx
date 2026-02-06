import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../lib/api";
import toast from "react-hot-toast";
import { Link } from "react-router";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("If the email exists, a reset link was sent 📧");
    },
    onError: () => {
      toast.success("If the email exists, a reset link was sent 📧");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({ email });
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-100 border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            className="btn btn-primary w-full"
            disabled={isPending || !email}
          >
            {isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-sm text-center">
          Remembered your password?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
