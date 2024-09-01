'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

const AddUser = () => {

  const router = useRouter()
  const [formData, setFormData] = useState({
    userPhoneNumber: "",
    userType: "",
    email: "",
    fixitName: "",
    WorkshopAddress: "",
    experience: 0,
    suspended: false,
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add new user");
      }

      const data = await response.json();
      setMessage("User added successfully");
      setFormData({
        userPhoneNumber: "",
        userType: "",
        email: "",
        fixitName: "",
        WorkshopAddress: "",
        experience: 0,
        suspended: false,
      });
      router.push("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Add New User</h1>

      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-black">
          <label className="block text-white">Phone Number</label>
          <input
            type="text"
            name="userPhoneNumber"
            value={formData.userPhoneNumber}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="text-black">
          <label className="block text-white">User Type</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          >
            <option value="" disabled>Select User Type</option>
            <option value="client">Client</option>
            <option value="service-provider">Service Provider</option>
          </select>
        </div>

        <div className="text-black">
          <label className="block text-white">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="text-black">
          <label className="block text-white">Fixit Name</label>
          <input
            type="text"
            name="fixitName"
            value={formData.fixitName}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="text-black">
          <label className="block text-white">Workshop Address</label>
          <input
            type="text"
            name="WorkshopAddress"
            value={formData.WorkshopAddress}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div className="text-black">
          <label className="block text-white">Experience (years)</label>
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            min="0"
            required
          />
        </div>

        <div className="text-black">
          <label className="block text-white">Suspended</label>
          <select
            name="suspended"
            value={formData.suspended}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Add User
        </button>
      </form>
    </div>
  );
};

export default AddUser;
