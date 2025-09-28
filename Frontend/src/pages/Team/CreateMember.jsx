// src/pages/team/CreateMember.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerMember, clearRegisterState, fetchPermissions } from "../../features/user/teamSlice";

const CreateMember = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    registerLoading,
    registerError,
    registerSuccess,
    permissions,
    permissionsLoading,
    permissionsError,
  } = useSelector((state) => state.team);

  const [form, setForm] = useState({
    username: "",
    email: "",
    fullname: "",
    password: "",
    permissions: [],
  });

  const [selectedPerms, setSelectedPerms] = useState([]);

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    if (registerSuccess) {
      navigate("/team");
      setTimeout(() => dispatch(clearRegisterState()), 500);
    }
  }, [registerSuccess, navigate, dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPermission = (perm) => {
    if (!selectedPerms.includes(perm)) {
      setSelectedPerms([...selectedPerms, perm]);
      setForm({ ...form, permissions: [...form.permissions, perm] });
    }
  };

  const handleRemovePermission = (perm) => {
    const updated = selectedPerms.filter((p) => p !== perm);
    setSelectedPerms(updated);
    setForm({ ...form, permissions: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerMember(form));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-green.png')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/90 rounded-[3rem] shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left */}
        <div className="flex flex-col items-center justify-center bg-[#f0f9ff] p-10">
          <img src="/logo.png" alt="KubeNetra Logo" className="w-40 h-40 mb-6" />
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-2xl font-bold text-gray-900">Add New Member</h2>
          <p className="text-gray-600 text-sm mb-6">Fill in the member details</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            {/* Permissions Multi-Select */}
            <div className="flex flex-col">
              <label className="mb-2 font-medium">Permissions:</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedPerms.map((perm) => (
                  <span
                    key={perm}
                    className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    {perm}
                    <button
                      type="button"
                      onClick={() => handleRemovePermission(perm)}
                      className="font-bold ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <select
                onChange={(e) => handleAddPermission(e.target.value)}
                value=""
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select permission...
                </option>
                {permissionsLoading && <option>Loading...</option>}
                {permissionsError && <option disabled>{permissionsError}</option>}
                {!permissionsLoading &&
                  !permissionsError &&
                  permissions.map((perm) => (
                    <option key={perm} value={perm}>
                      {perm}
                    </option>
                  ))}
              </select>
            </div>

            {registerError && <p className="text-red-600 text-sm">{registerError}</p>}
            {registerSuccess && <p className="text-green-600 text-sm">Member added successfully!</p>}

            <button
              type="submit"
              disabled={registerLoading}
              className="w-full bg-blue-600 text-white p-3 rounded-full font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {registerLoading ? "Adding..." : "Add Member"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMember;
