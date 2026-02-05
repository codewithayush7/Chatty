import { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmail, resendVerificationEmail } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "../components/PageLoader";
import toast from "react-hot-toast";

const COOLDOWN_SECONDS = 30;

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const queryClient = useQueryClient();
  const { authUser, isLoading } = useAuthUser();

  // cooldown state
  const [cooldown, setCooldown] = useState(0);

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: async () => {
      toast.success("Email verified successfully 🎉");
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Invalid or expired verification link",
      );
    },
  });

  const resendMutation = useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      toast.success("Verification email resent 📧");
      setCooldown(COOLDOWN_SECONDS);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to resend email");
    },
  });

  // verify once when token exists
  useEffect(() => {
    if (!token) return;
    if (verifyMutation.isPending || verifyMutation.isSuccess) return;
    verifyMutation.mutate(token);
  }, [token, verifyMutation]);

  // cooldown timer
  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  if (isLoading) return <PageLoader />;

  // already verified → onboarding
  if (authUser?.isEmailVerified) {
    return <Navigate to={authUser.isOnboarded ? "/" : "/onboarding"} replace />;
  }

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-100 border border-primary/20 rounded-xl shadow-lg p-6 text-center space-y-4">
        {!token && (
          <>
            <h2 className="text-xl font-semibold">Verify your email</h2>
            <p className="opacity-70">
              We’ve sent a verification link to your email.
              <br />
              Please check your inbox.
            </p>

            <button
              className="btn btn-outline btn-primary mt-4"
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending || cooldown > 0}
            >
              {resendMutation.isPending
                ? "Sending..."
                : cooldown > 0
                  ? `Resend available in ${cooldown}s`
                  : "Resend verification email"}
            </button>
          </>
        )}

        {token && verifyMutation.isPending && (
          <>
            <span className="loading loading-spinner loading-lg"></span>
            <p className="opacity-70">Verifying your email…</p>
          </>
        )}
        {token && verifyMutation.isError && (
          <>
            <h2 className="text-xl font-semibold text-error">
              Verification failed
            </h2>
            <p className="opacity-70 text-sm">
              The verification link is invalid or has expired.
            </p>
            <button
              className="btn btn-outline btn-primary mt-4"
              onClick={() => resendMutation.mutate()}
              disabled={resendMutation.isPending || cooldown > 0}
            >
              {cooldown > 0
                ? `Resend available in ${cooldown}s`
                : "Resend verification email"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
