// pages/admin/ServiceAreas.js
import React, { useEffect, useState } from "react";
import Title from "../../components/admin/Title";
import { useAppContext } from "../../components/context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const ServiceAreas = () => {
  const { user, fetchUser } = useAppContext();
  const [role, setRole] = useState("");
  const [areas, setAreas] = useState([]);
  const [newArea, setNewArea] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user) {
          await fetchUser();
        }
        setRole(user?.role || "");
        if (user?.role === "admin") {
          await fetchAreas();
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [user, fetchUser]);

  const fetchAreas = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get("/api/admin/service-areas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setAreas(data.areas || []);
      }
    } catch (error) {
      console.error("Failed to fetch areas:", error);
      toast.error("Failed to load service areas");
    }
  };

  const handleAddArea = async (e) => {
    e.preventDefault();

    if (!newArea.trim()) {
      toast.error("Please enter a valid location name");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "/api/admin/add-service-area",
        { area: newArea.trim() }, // ✅ Send area in body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        toast.success("Service area added successfully");
        setNewArea("");
        await fetchAreas();
      }
    } catch (error) {
      console.error("Add area error:", error);
      toast.error(error.response?.data?.message || "Failed to add service area");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArea = async (areaId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(`/api/admin/service-area/${areaId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success("Service area deleted successfully");
        await fetchAreas();
      }
    } catch (error) {
      console.error("Delete area error:", error);
      toast.error("Failed to delete service area");
    }
  };

  if (role !== "admin") {
    return (
      <div className="w-full flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Access Denied</h2>
          <p className="text-gray-600 mt-2">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Title
        title="Service Areas Management"
        subTitle="Manage available delivery locations"
      />

      {/* Add New Area Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
        <h3 className="text-lg font-semibold mb-4">Add New Service Area</h3>
        <form onSubmit={handleAddArea} className="flex gap-4">
          <input
            type="text"
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            placeholder="Enter location name (e.g., Downtown, Uptown)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Area"}
          </button>
        </form>
      </div>

      {/* Service Areas List */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          Service Areas ({areas.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {areas.length > 0 ? (
            areas.map((area) => (
              <div
                key={area._id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center"
              >
                <span className="font-medium">{area.area}</span>
                <button
                  onClick={() => handleDeleteArea(area._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No service areas added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceAreas;