import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { changePassword, resetPasswordState } from "../../features/user/changePasswordSlice";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector((state) => state.changePassword);

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [mismatch, setMismatch] = useState(false);

  useEffect(() => {
    if (success) {
      alert("Password updated successfully!");
      dispatch(resetPasswordState());
      navigate("/home");
    }
  }, [success, dispatch, navigate]);

  const handleChange = (e) => {
    const updatedForm = { ...form, [e.target.name]: e.target.value };
    setForm(updatedForm);

    // ✅ confirm password check
    if (updatedForm.newPassword && updatedForm.confirmPassword) {
      setMismatch(updatedForm.newPassword !== updatedForm.confirmPassword);
    } else {
      setMismatch(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mismatch) return; // agar galat confirm hai toh submit mat karna

    dispatch(changePassword({ 
      oldPassword: form.oldPassword, 
      newPassword: form.newPassword 
    }));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-auth.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/90 rounded-[3rem] shadow-xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left */}
        <div className="flex flex-col items-center justify-center bg-[#fdf6ec] p-10">
          <img src="/logo.png" alt="KubeNetra Logo" className="w-40 h-40 mb-6" />
        </div>

        {/* Right */}
        <div className="flex flex-col justify-center p-10">
          <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
          <p className="text-gray-600 text-sm mb-6">Update your account password</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={form.oldPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg border ${
                mismatch ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500`}
            />

            {mismatch && (
              <p className="text-red-600 text-sm">Confirm password does not match</p>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">Password changed!</p>}

            <button
              type="submit"
              disabled={loading || mismatch}
              className={`w-full p-3 rounded-full font-medium transition ${
                mismatch
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              } disabled:opacity-50`}
            >
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
