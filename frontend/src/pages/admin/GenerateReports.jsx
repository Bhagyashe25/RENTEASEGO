// // pages/admin/GenerateReports.js
// import React, { useEffect, useState } from 'react';
// import Title from '../../components/admin/Title';
// import { useAppContext } from '../../components/context/AppContext';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const GenerateReports = () => {
//   const { user, fetchUser } = useAppContext();
//   const [role, setRole] = useState(user?.role || '');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!user) fetchUser();
//     else setRole(user.role);
//   }, [user, fetchUser]);

//   // const handleDownloadSalesReport = async () => {
//   //   if (role !== 'admin') {
//   //     toast.error('Access denied');
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   try {
//   //     const { data } = await axios.get('/api/admin/reports/sales');
//   //     if (data.success) {
//   //       // Create download link
//   //       const url = window.URL.createObjectURL(new Blob([data.report]));
//   //       const link = document.createElement('a');
//   //       link.href = url;
//   //       link.setAttribute('download', 'sales_report.pdf');
//   //       document.body.appendChild(link);
//   //       link.click();
//   //       link.remove();
//   //       toast.success('Report downloaded successfully');
//   //     }
//   //   } catch (err) {
//   //     toast.error(err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleDownloadDamageReport = async () => {
//   //   if (role !== 'admin') {
//   //     toast.error('Access denied');
//   //     return;
//   //   }

//   //   setLoading(true);
//   //   try {
//   //     const { data } = await axios.get('/api/admin/reports/damage');
//   //     if (data.success) {
//   //       const url = window.URL.createObjectURL(new Blob([data.report]));
//   //       const link = document.createElement('a');
//   //       link.href = url;
//   //       link.setAttribute('download', 'damage_report.csv');
//   //       document.body.appendChild(link);
//   //       link.click();
//   //       link.remove();
//   //       toast.success('Report downloaded successfully');
//   //     }
//   //   } catch (err) {
//   //     toast.error(err.message);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   return (
//     <div className="w-full">
//       <Title
//         title="Platform Analytics"
//         subTitle="Download revenue, user growth, and damage claim reports."
//       />
//       {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
//         <button
//           onClick={handleDownloadSalesReport}
//           disabled={loading}
//           className="p-10 border-2 border-dashed border-primary text-primary rounded-xl hover:bg-primary/10 transition"
//         >
//           {loading ? 'Downloading...' : 'Download Sales Report (PDF)'}
//         </button>
//         <button
//           onClick={handleDownloadDamageReport}
//           disabled={loading}
//           className="p-10 border-2 border-dashed border-secondary text-secondary rounded-xl hover:bg-secondary/10 transition"
//         >
//           {loading ? 'Downloading...' : 'Download Damage Claims (CSV)'}
//         </button>
//       </div> */}
//     </div>
//   );
// };

// export default GenerateReports;