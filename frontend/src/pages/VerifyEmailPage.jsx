import { useEffect, useState, useRef } from "react";
import { useSearchParams, Navigate, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyEmail, resendVerificationEmail } from "../lib/api";
import useAuthUser from "../hooks/useAuthUser";
import PageLoader from "../components/PageLoader";
import toast from "react-hot-toast";

const COOLDOWN_SECONDS = 60;

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const { authUser, isLoading } = useAuthUser();

  // cooldown state
  const [cooldown, setCooldown] = useState(0);

  // ✅ Track if we've already tried to verify
  const hasVerifiedRef = useRef(false);

  const verifyMutation = useMutation({
    mutationFn: verifyEmail,
    onSuccess: async () => {
      toast.success("Email verified successfully 🎉");

      // ✅ Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });

      // ✅ Wait a bit for the state to update
      setTimeout(() => {
        const userData = queryClient.getQueryData(["authUser"]);
        if (userData?.user?.isOnboarded) {
          navigate("/", { replace: true });
        } else {
          navigate("/onboarding", { replace: true });
        }
      }, 300);
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Verification failed. Try again.",
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

  // ✅ FIXED: verify once when token exists
  useEffect(() => {
    console.log("🔍 VerifyEmailPage useEffect triggered");
    console.log("Token:", token);
    console.log("Has verified ref:", hasVerifiedRef.current);

    if (!token) {
      console.log("❌ No token, skipping verification");
      return;
    }

    if (hasVerifiedRef.current) {
      console.log("❌ Already verified, skipping");
      return;
    }

    console.log("✅ Calling verifyMutation.mutate with token:", token);
    hasVerifiedRef.current = true;
    verifyMutation.mutate({ token });
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // cooldown timer
  useEffect(() => {
    if (cooldown === 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  if (isLoading) {
    console.log("⏳ Auth user loading...");
    return <PageLoader />;
  }

  // already verified → onboarding
  if (authUser?.isEmailVerified) {
    console.log("✅ User already verified, redirecting");
    return <Navigate to={authUser.isOnboarded ? "/" : "/onboarding"} replace />;
  }

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-100 border border-primary/20 rounded-xl shadow-lg p-6 text-center space-y-4">
        {!token && (
          <>
            <h2 className="text-xl font-semibold">Verify your email</h2>
            <p className="opacity-70">
              We've sent a verification link to your email.
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
