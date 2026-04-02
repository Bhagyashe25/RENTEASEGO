// src/pages/vendor/Maintenance.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "../../components/admin/Title";
import toast from "react-hot-toast";
import { useAppContext } from "../../components/context/AppContext";

const Maintenance = () => {
  const { user, token, fetchUser } = useAppContext();
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMaintenanceData = async () => {
    try {
      console.log("🔍 Fetching maintenance data...");
      
      if (!user || user.role !== "vendor") {
        toast.error("Please login as vendor");
        setLoading(false);
        return;
      }

      if (!token) {
        toast.error("Please login to access this page");
        setLoading(false);
        return;
      }

      const { data } = await axios.get("/api/vendor/maintenance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      if (data.success) {
        setMaintenanceList(data.maintenance || []);
        setReturnsList(data.returns || []);
        setError(null);
        console.log("✅ Maintenance found:", data.maintenance?.length || 0);
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("❌ Maintenance fetch error:", error.response?.data || error);
      const errorMsg = error.response?.data?.message || error.message || "Failed to load data";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token && user.role === "vendor") {
      fetchMaintenanceData();
    }
  }, [user, token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Title
        title="Maintenance & Returns"
        subTitle="Monitor product health and handle damage reports."
      />

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Error: {error}</p>
          <button
            onClick={fetchMaintenanceData}
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Maintenance Requests */}
        <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">🔧 Maintenance Requests</h2>
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
              {maintenanceList.length}
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-gray-500">Loading...</span>
            </div>
          ) : maintenanceList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                ✅
              </div>
              <p className="text-lg font-medium">No maintenance requests</p>
              <p className="text-sm">Users haven't reported any issues yet.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {maintenanceList.map((item) => (
                <div key={item._id} className="p-4 bg-linear-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 text-base truncate max-w-[70%]">
                      {item.productName}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : item.status === 'resolved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.status?.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    <strong>Issue:</strong> {item.issue}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.userName}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  
                  {item.description && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer text-blue-600 hover:text-blue-800">
                        View description
                      </summary>
                      <p className="mt-1 text-xs text-gray-600 bg-white p-2 rounded border">
                        {item.description}
                      </p>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Returns Monitoring */}
        <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">📦 Incoming Returns</h2>
            <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
              {returnsList.length}
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="ml-2 text-gray-500">Loading...</span>
            </div>
          ) : returnsList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                📦
              </div>
              <p className="text-lg font-medium">No incoming returns</p>
              <p className="text-sm">No products are being returned.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {returnsList.map((item) => (
                <div key={item._id} className="p-4 bg-linear-to-r from-gray-50 to-orange-50 border border-gray-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 text-base truncate">
                      {item.productName}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'returned' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.status.replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{item.userName}</span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  
                  <div className="mt-2 p-2 bg-white rounded text-xs text-gray-600 border">
                    Cart ID: <code className="font-mono bg-gray-100 px-1 rounded">
                      {item._id?.slice(-8)}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

     
    </div>
  );
};

export default Maintenance;