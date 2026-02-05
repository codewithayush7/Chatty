import { useState } from "react";
import { useSearchParams, Navigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../lib/api";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successful 🔐");
      setSuccess(true);
    },
  });

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    mutate({ token, password });
  };

  if (success) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-100 border rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center">Reset Password</h2>

        {error && (
          <div className="alert alert-error">
            {error.response?.data?.message || "Invalid or expired link"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary w-full" disabled={isPending}>
            {isPending ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
