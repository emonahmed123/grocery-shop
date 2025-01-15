/* eslint-disable @typescript-eslint/no-explicit-any */

// const Table = async () => {
//   const users = await fetch(
//     "https://grocery-store-server-orpin.vercel.app/api/auth/alluser",
//     {
//       cache: "no-store",
//     }
//   );
//   const { data } = await users.json();

//   return (
//     <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
//       <div className="max-w-full overflow-x-auto">
//         <table className="w-full table-auto">
//           <thead>
//             <tr className="bg-gray-2 text-left dark:bg-meta-4">
//               <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
//                 Name
//               </th>
//               <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
//                 Email
//               </th>
//               <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
//                 Role
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {data?.map((user: any, key: any) => (
//               <tr key={key}>
//                 <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
//                   <h5 className="font-medium text-black dark:text-white">
//                     {user?.name}
//                   </h5>
//                 </td>
//                 <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
//                   <p className="text-black dark:text-white">{user?.email}</p>
//                 </td>
//                 <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
//                   <p
//                     className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
//                       user?.role === "admin"
//                         ? "bg-success text-success"
//                         : user?.role === "user"
//                         ? "bg-danger text-danger"
//                         : "bg-warning text-warning"
//                     }`}
//                   >
//                     {user?.role}
//                   </p>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// 

"use client"
import React, { useState, useEffect } from 'react';

const Table = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      const users = await fetch(
        "https://grocery-store-server-orpin.vercel.app/api/auth/alluser"

      );
      const { data } = await users.json();
      setData(data);
    };

    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  //hell
  return (
    <div>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto ">

          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Email
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user: any, key: any) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">
                      {user?.name}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{user?.email}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${user?.role === "admin"
                        ? "bg-success text-success"
                        : user?.role === "user"
                          ? "bg-danger text-danger"
                          : "bg-warning text-warning"
                        }`}
                    >
                      {user?.role}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
            <caption className="caption-bottom">
              <div className="flex justify-center mt-4 pb-5">
                {Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-success text-white' : 'bg-white text-black'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </caption>
          </table>

        </div>
      </div>

    </div>
  );
};

export default Table;