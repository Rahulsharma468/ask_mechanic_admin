"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suspendedFilter, setSuspendedFilter] = useState("");
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    userPhoneNumber: "",
    userType: "",
    email: "",
    experience: 0,
    fixitName: "",
    WorkshopAddress: "",
    specialCategory: [],
    fixitImage: "",
  });

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/user`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const allUsersData = await response.json();
      setUsers(allUsersData.data);
      categorizeUsers(allUsersData.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

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
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to suspend user");
      }

      await fetchAllUsers();
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const handleAddUser = () => {
    router.push("/adduser");
  };

  const handleProjects = () => {
    router.push("/projects");
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/logout`, {
        method: "POST",
      });

      document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;

      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      userPhoneNumber: user.userPhoneNumber,
      userType: user.userType,
      email: user.email,
      experience: user.experience,
      fixitName: user.fixitName,
      WorkshopAddress: user.WorkshopAddress,
      specialCategory: user.specialCategory.join(", "),
      fixitImage: user.fixitImage,
    });
    setEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URI}/user`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: selectedUser._id, updates: editFormData }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setEditModalOpen(false);
      await fetchAllUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

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
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">Users</h1>

        <div className="flex gap-2">
          <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={handleAddUser}
        >
          Add User
        </button>
       

      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        onClick={handleProjects}
      >
        Projects
      </button>

       <button
        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        onClick={handleLogout}
      >
        Logout
      </button>
        </div>
      </div>

      

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
              <div className="mt-2 flex space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  onClick={() => handleSuspendUser(user._id)}
                >
                  {user.suspended ? "Unsuspend User" : "Suspend User"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
              <div className="mt-2 flex space-x-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  onClick={() => handleSuspendUser(user._id)}
                >
                  {user.suspended ? "Unsuspend User" : "Suspend User"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                name="userPhoneNumber"
                value={editFormData.userPhoneNumber}
                onChange={handleEditInputChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                name="userType"
                value={editFormData.userType}
                onChange={handleEditInputChange}
                className="border p-2 rounded w-full"
              >
                <option value="client">Client</option>
                <option value="service-provider">Service Provider</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={editFormData.email}
                onChange={handleEditInputChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
              <input
                type="number"
                name="experience"
                value={editFormData.experience}
                onChange={handleEditInputChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Fixit Name</label>
              <input
                type="text"
                name="fixitName"
                value={editFormData.fixitName}
                onChange={handleEditInputChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Workshop Address</label>
              <input
                type="text"
                name="WorkshopAddress"
                value={editFormData.WorkshopAddress}
                onChange={handleEditInputChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Special Category (comma separated)</label>
              <input
                type="text"
                name="specialCategory"
                value={editFormData.specialCategory}
                onChange={handleEditInputChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Fixit Image URL</label>
              <input
                type="text"
                name="fixitImage"
                value={editFormData.fixitImage}
                onChange={handleEditInputChange}
                className="border p-2 rounded w-full"
              />
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 mr-2"
                onClick={handleUpdateUser}
              >
                Update
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
