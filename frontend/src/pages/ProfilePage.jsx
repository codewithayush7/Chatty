import useAuthUser from "../hooks/useAuthUser";
import { Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isLoading } = useAuthUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <main className="p-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={authUser?.profilePic}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4"
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.fullName || "-"}
              </p>
            </div>

            <div>
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {authUser?.email || "-"}
              </p>
            </div>
          </div>

          <div className="bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span>Member Since</span>
                <span>{authUser?.createdAt?.split("T")[0] || "-"}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
