// src/pages/team/TeamHome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMembers } from "../../features/user/teamSlice";
import MemberCard from "../../components/MemberCard";
import TeamNavbar from "../../components/TeamNavbar";
import { Plus } from "lucide-react";
import axios from "axios";

const TeamHome = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: members, loading, error } = useSelector((state) => state.team);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch members on mount
  useEffect(() => {
    dispatch(fetchAllMembers());

    const saved = localStorage.getItem("searchTerm");
    if (saved) setSearchTerm(saved);
  }, [dispatch]);

  // ✏️ Update member handler
  const handleUpdate = (id) => {
    navigate(`/team/updateMember/${id}`);
  };

  // 🗑️ Delete member handler with API call
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      // call API
      await axios.delete(`/api/v1/users/deleteUser/${id}`);
      // refetch members
      dispatch(fetchAllMembers());
      alert("Member deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete member.");
    }
  };

  // ➕ Add new member
  const handleAdd = () => {
    navigate("/team/addMember");
  };

  // ✅ Safe filtering
  const filteredMembers = Array.isArray(members)
    ? members.filter(
        (m) =>
          m.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center"
      style={{ backgroundImage: "url('/bg-green.png')" }}
    >
      {/* Scrolling Navbar */}
      <TeamNavbar onSearch={setSearchTerm} />

      <div className="flex-1 w-[90%] mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mt-28 mb-12">
        <section className="py-12 px-6 md:px-16">
          <h2 className="text-3xl font-bold text-center mb-2">TEAM MEMBERS</h2>
          <p className="text-center text-gray-600 mb-10">
            Here are your team members. Click a member to update or remove, or add a new one.
          </p>

          {loading && <p className="text-center text-blue-600 font-medium">Loading members...</p>}
          {error && <p className="text-center text-red-600 font-medium">{error}</p>}

          {!loading && !error && (
            <>
              {filteredMembers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {filteredMembers.map((member) => (
                    <MemberCard
                      key={member._id}
                      member={member}
                      onDelete={handleDelete}
                      onUpdate={handleUpdate}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No members match your search.</p>
              )}
            </>
          )}
        </section>
      </div>

      {/* ➕ Floating Add Member Button */}
      <button
        onClick={handleAdd}
        className="fixed bottom-10 right-10 bg-blue-500 hover:bg-red-600 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default TeamHome;
