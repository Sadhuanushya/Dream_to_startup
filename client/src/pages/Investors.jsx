import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchInvestorsList } from "../Slice/Investor-Slice";
import { FiMapPin } from "react-icons/fi";

export default function Investors() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.investor);

  useEffect(() => {
    dispatch(fetchInvestorsList());
  }, [dispatch]);

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-800">Investors</h1>
        <p className="text-slate-500 mt-1">Find investors relevant to your startup.</p>
      </div>

      {/* Investors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data?.map((ele) => (
          <div
            key={ele._id}
            className="group bg-slate-50 border border-slate-100 rounded-[2rem] p-6 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col"
          >
            {/* Top Section */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={ele.profilePicture?.DocumentUrl || "https://via.placeholder.com/80"}
                alt={ele.fullName}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h3 className="font-black text-slate-800 text-lg">{ele.fullName}</h3>
                <span className="inline-block mt-1 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {ele.investorType}
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-3">{ele.bio}</p>

            {/* Preferred Sectors (names only) */}
<div className="flex flex-wrap gap-2 mb-4">
  {ele.prefferedSector?.map((item, idx) => (
    <span
      key={idx}
      className="text-xs font-semibold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full"
    >
      {item.sector} <span className="text-[10px] font-normal">(Preferred)</span>
    </span>
  ))}
</div>

            {/* Location */}
            <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
              <FiMapPin /> {ele.officeLocation?.city}, {ele.officeLocation?.state}
            </div>

            {/* Request Button */}
            <button className="mt-auto bg-indigo-600 text-white text-sm font-black px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow shadow-indigo-100">
              Request
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {data?.length === 0 && (
        <div className="text-center py-20 text-slate-500">No investors found.</div>
      )}
    </div>
  );
}
