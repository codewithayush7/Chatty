import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import PageLoader from "../components/PageLoader";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router";

const FriendsPage = () => {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex h-screen">
      {/* Sidebar (Always Visible on Desktop) */}
      <aside className="w-64 hidden md:flex flex-col bg-base-200 border-r">
        <Sidebar />
      </aside>

      {/* Main Area: Navbar + Page Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar inside main content area */}
        <Navbar />

        {/* Main Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Friends</h2>
            <Link to="/notifications" className="btn btn-outline">
              <i className="fa fa-user-friends mr-2" />
              Friend Requests
            </Link>
          </div>

          {friends?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>
          ) : (
            <p>No friends found.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default FriendsPage;
