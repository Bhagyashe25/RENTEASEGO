import React, { useEffect, useState } from "react";
import axios from "axios";
import Title from "../../components/admin/Title";

const Logistics = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSchedules = async () => {
    try {
      const { data } = await axios.get("/api/vendor/logistics");
      if (data.success) {
        setSchedules(data.schedules);
      }
    } catch (error) {
      console.error("Logistics fetch error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="p-6 w-full">
      <Title
        title="Logistics Schedule"
        subTitle="View upcoming deliveries and rental pickups."
      />

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading schedules...</p>
        ) : schedules.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No schedules found.</p>
        ) : (
          schedules.map(item => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm"
            >
              <div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    item.type === "Delivery"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {item.type ? item.type.toUpperCase() : "UNKNOWN"}
                </span>
                <h3 className="font-semibold mt-1">{item.item}</h3>
                <p className="text-gray-500 text-sm">{item.address}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{item.date}</p>
                <p className="text-xs text-gray-400">{item.slot}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Logistics;