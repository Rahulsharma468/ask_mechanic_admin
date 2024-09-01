"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const Home = () => {
  const router = useRouter(); // Initialize useRouter hook for navigation
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const [suspendedFilter, setSuspendedFilter] = useState(""); // State for suspended filter

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URI}/user`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const allUsersData = await response.json();
        setUsers(allUsersData.data); // Assuming the fetched data is in the `data` key

        categorizeUsers(allUsersData.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  const categorizeUsers = (usersData) => {
    const categorizedClients = usersData.filter(
      (user) => user.userType === "client"
    );
    const categorizedServiceProviders = usersData.filter(
      (user) => user.userType === "service-provider"
    );

    setClients(categorizedClients);
    setServiceProviders(categorizedServiceProviders);
  };

  const handleSuspendUser = async (userId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/user/suspend`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Send userId in the request body
        }
      );

      if (!response.ok) {
        throw new Error("Failed to suspend user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, suspended: !user.suspended } : user
        )
      );

      categorizeUsers(users); // Re-categorize users after suspension
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  // Function to handle navigation to the Add User page
  const handleAddUser = () => {
    router.push("/adduser"); // Update the route to match your Add User page
  };

  // Function to filter users based on suspended status and search query
  const getFilteredUsers = (usersList) => {
    return usersList.filter((user) => {
      const matchesSearchQuery =
        user.userPhoneNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        user.userType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSuspendedFilter =
        suspendedFilter === ""
          ? true
          : suspendedFilter === "suspended"
          ? user.suspended
          : !user.suspended;

      return matchesSearchQuery && matchesSuspendedFilter;
    });
  };

  return (
    <div className="p-4 text-black">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4 text-white">Users</h1>

        {/* Add User Button */}
        <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={handleAddUser}
        >
          Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex mb-4 space-x-4">
        <input
          type="text"
          placeholder="Search by username or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={suspendedFilter}
          onChange={(e) => setSuspendedFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Users</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Display Clients */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-white">Clients</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {getFilteredUsers(clients).map((user) => (
            <div
              key={user._id}
              className={`p-4 border rounded-lg shadow-md ${
                user.suspended ? "bg-gray-200 text-gray-500" : "bg-white"
              }`}
            >
              <h2 className="text-lg font-semibold">{user.userPhoneNumber}</h2>
              <p>User Type: {user.userType}</p>
              <p>Experience: {user.experience} years</p>
              <p>Status: {user.suspended ? "Suspended" : "Active"}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={() => handleSuspendUser(user._id)}
              >
                {user.suspended ? "Unsuspend User" : "Suspend User"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Display Service Providers */}
      <div>
        <h2 className="text-xl font-bold mb-2 text-white">Service Providers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {getFilteredUsers(serviceProviders).map((user) => (
            <div
              key={user._id}
              className={`p-4 border rounded-lg shadow-md ${
                user.suspended ? "bg-gray-200 text-gray-500" : "bg-white"
              }`}
            >
              <h2 className="text-lg font-semibold">{user.userPhoneNumber}</h2>
              <p>User Type: {user.userType}</p>
              <p>Experience: {user.experience} years</p>
              <p>Status: {user.suspended ? "Suspended" : "Active"}</p>
              <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={() => handleSuspendUser(user._id)}
              >
                {user.suspended ? "Unsuspend User" : "Suspend User"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
