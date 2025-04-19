import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ENDPOINTS } from "../../utilities/constants";

const presetAvatars = [
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=21",
  "https://i.pravatar.cc/150?img=30",
];

export default function RegisterForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [role, setRole] = useState("customer");
  const [adminPass, setAdminPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [selectedAvatar, setSelectedAvatar] = useState(presetAvatars[0]);
  const [popAnimation, setPopAnimation] = useState(false);

  const triggerPop = () => {
    setPopAnimation(true);
    setTimeout(() => setPopAnimation(false), 250);
  };

  useEffect(() => {
    if (!avatar.trim()) {
      setSelectedAvatar(presetAvatars[0]);
    } else {
      setSelectedAvatar(avatar);
    }
    triggerPop();
  }, [avatar]);

  const validateForm = () => {
    const newErrors = {};
    if (!/^[A-Za-z0-9_]{3,}$/.test(username)) {
      newErrors.username = "At least 3 characters, only letters/numbers/_";
    }
    if (!/^\S+@stud\.noroff\.no$/.test(email)) {
      newErrors.email = "Must be a valid stud.noroff.no email";
    }
    if (password.length < 8) {
      newErrors.password = "At least 8 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (role === "admin" && adminPass !== "superSecret123") {
      newErrors.adminPass = "Wrong admin password";
    }
    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm();
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
      adminPass: role === "admin",
    });

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(ENDPOINTS.register, {
        name: username,
        email,
        password,
        avatar: {
          url: selectedAvatar,
          alt: `${username}'s avatar`,
        },
        venueManager: role === "admin",
      });

      if (response.status === 201) {
        toast.success("Account created! 🎉 You can now log in");
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error:", err);
      setErrors({ form: err.response?.data?.error || "Something went wrong." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-creamy text-center">
      <div className="bg-white p-8 rounded-t-3xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-goldy mb-2">SIGN UP</h1>

        <form onSubmit={handleRegister} className="space-y-4 text-left">
          {/* Username */}
          <div>
            <label className="text-sm">Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={() => handleBlur("username")}
              className={`w-full border p-2 rounded focus:outline-none transition-colors duration-300 ${
                touched.username && errors.username ? "border-error shake" : "border-espressoy"
              }`}
            />
            {touched.username && errors.username && (
              <p className="text-error text-sm">{errors.username}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm">Email *</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`w-full border p-2 rounded focus:outline-none transition-colors duration-300 ${
                touched.email && errors.email ? "border-error shake" : "border-espressoy"
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-error text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                className={`w-full border p-2 pr-10 rounded focus:outline-none transition-colors duration-300 ${
                  touched.password && errors.password ? "border-error shake" : "border-espressoy"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-2 transform -translate-y-1/2"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {touched.password && errors.password && (
              <p className="text-error text-sm">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => handleBlur("confirmPassword")}
              className={`w-full border p-2 rounded focus:outline-none transition-colors duration-300 ${
                touched.confirmPassword && errors.confirmPassword ? "border-error shake" : "border-espressoy"
              }`}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-error text-sm">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Avatar input + preview */}
          <div>
            <label className="text-sm">Avatar URL (optional)</label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="Paste an image URL..."
              className="w-full border p-2 rounded focus:outline-none border-espressoy"
            />

            {/* Avatar Preview */}
            <div className="mt-4">
              <div className="mx-auto w-42 h-42 rounded-full border-4 border-goldy overflow-hidden mb-2">
                <img
                  src={selectedAvatar}
                  alt="Avatar preview"
                  className={`w-full h-full object-cover ${popAnimation ? "avatar-pop" : ""}`}
                />
              </div>

              {/* Preset Avatar Options */}
              <div className="flex justify-center gap-2">
                {presetAvatars.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(url);
                      setAvatar("");
                      triggerPop();
                    }}
                    className={`w-10 h-10 rounded-full border-2 overflow-hidden ${
                      selectedAvatar === url ? "border-goldy" : "border-gray-300"
                    }`}
                  >
                    <img src={url} alt="Preset avatar option" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2 rounded focus:outline-none border-espressoy"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Admin password */}
          {role === "admin" && (
            <div>
              <label className="text-sm">Admin Register Password *</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                onBlur={() => handleBlur("adminPass")}
                className={`w-full border p-2 rounded focus:outline-none transition-colors duration-300 ${
                  touched.adminPass && errors.adminPass ? "border-error shake" : "border-espressoy"
                }`}
              />
              {touched.adminPass && errors.adminPass && (
                <p className="text-error text-sm">{errors.adminPass}</p>
              )}
            </div>
          )}

          {errors.form && <p className="text-error text-sm">{errors.form}</p>}

          <button
            type="submit"
            className="w-full bg-goldy text-white rounded-full py-2 font-semibold hover:opacity-90"
          >
            SIGN UP
          </button>
        </form>

        <p className="text-sm mt-4">
          Already a member?{" "}
          <Link to="/login" className="text-goldy underline hover:text-espressoy">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
