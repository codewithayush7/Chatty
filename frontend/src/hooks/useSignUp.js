import { useMutation } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const useSignUp = () => {
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("Verification email sent. Check your inbox 📧");
      navigate("/verify-email");
    },
  });

  return { isPending, error, signupMutation: mutate };
};

export default useSignUp;
