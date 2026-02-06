import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard";
import PageLoader from "../components/PageLoader";
import { Link } from "react-router-dom";

const FriendsPage = () => {
  const { data: friends, isLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  if (isLoading) return <PageLoader />;

  return (
    <main className="p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Friends</h2>
        <Link to="/notifications" className="btn btn-outline">
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
  );
};

export default FriendsPage;
