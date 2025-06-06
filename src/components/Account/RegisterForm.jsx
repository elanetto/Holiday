import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { ENDPOINTS } from "../../utilities/constants";

const presetAvatars = [
  "https://raw.githubusercontent.com/elanetto/Holiday/c57b65c718a51299ee10cbd64c850fff83d4b318/src/assets/avatar/avatar_option_1.svg",
  "https://raw.githubusercontent.com/elanetto/Holiday/c57b65c718a51299ee10cbd64c850fff83d4b318/src/assets/avatar/avatar_option_2.svg",
  "https://raw.githubusercontent.com/elanetto/Holiday/c57b65c718a51299ee10cbd64c850fff83d4b318/src/assets/avatar/avatar_option_3.svg",
  "https://raw.githubusercontent.com/elanetto/Holiday/c57b65c718a51299ee10cbd64c850fff83d4b318/src/assets/avatar/avatar_option_4.svg",
];

export default function RegisterForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
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
        venueManager: false,
      });

      if (response.status === 201) {
        localStorage.setItem("name", username);
        localStorage.setItem("email", email);

        toast.success("Account created! 🎉 You can now log in");
        navigate("/login");
      }
    } catch (err) {
      console.error("Register error:", err);

      const defaultMsg = "Something went wrong. Please try again.";
      const detailedMsg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.error ||
        defaultMsg;

      toast.error(detailedMsg); // Optional
      setErrors({ form: detailedMsg });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start text-center px-2 sm:px-2 md:px-4 py-8 md:py-8">
      <div className="p-4 sm:p-6 md:p-10 rounded-2xl w-full max-w-4xl grid md:grid-cols-2 gap-10 items-start bg-creamy">
        <h1 className="text-2xl font-bold text-espressoy mb-4 md:col-span-2 text-center">
          SIGN UP
        </h1>

        <div className="md:col-span-1">
          <form
            id="register-form"
            onSubmit={handleRegister}
            className="space-y-4 text-left"
          >
            {/* Username */}
            <div>
              <label className="text-sm">Username *</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => handleBlur("username")}
                className={`w-full bg-white border p-2 rounded focus:outline-none transition-colors duration-300 ${
                  touched.username && errors.username
                    ? "border-error shake"
                    : "border-espressoy"
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
                className={`w-full bg-white border p-2 rounded focus:outline-none transition-colors duration-300 ${
                  touched.email && errors.email
                    ? "border-error shake"
                    : "border-espressoy"
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
                  className={`w-full bg-white border p-2 pr-10 rounded focus:outline-none transition-colors duration-300 ${
                    touched.password && errors.password
                      ? "border-error shake"
                      : "border-espressoy"
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
                className={`w-full bg-white border p-2 rounded focus:outline-none transition-colors duration-300 ${
                  touched.confirmPassword && errors.confirmPassword
                    ? "border-error shake"
                    : "border-espressoy"
                }`}
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="text-error text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {errors.form && <p className="text-error text-sm">{errors.form}</p>}
          </form>
        </div>

        <div className="md:col-span-1 flex flex-col justify-between h-full">
          <div>
            <div className="text-left mb-4">
              <label className="text-sm">Avatar URL (optional)</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="Paste an image URL..."
                className="w-full bg-white border p-2 rounded focus:outline-none border-espressoy"
              />
            </div>

            <div className="mt-4">
              <div className="mx-auto w-42 h-42 rounded-full border-2 border-espressoy overflow-hidden mb-2">
                <img
                  src={selectedAvatar}
                  alt="Avatar preview"
                  className={`w-full h-full object-cover ${
                    popAnimation ? "avatar-pop" : ""
                  }`}
                />
              </div>

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
                      selectedAvatar === url
                        ? "border-espressoy"
                        : "border-gray-300"
                    }`}
                  >
                    <img src={url} alt="Preset avatar option" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-left">
            <p className="text-sm mb-4">
              <strong>Important:</strong> Your{" "}
              <span className="font-semibold text-error">
                username, email, and password
              </span>{" "}
              cannot be changed later. Please double-check them before signing
              up.
            </p>

            <button
              type="submit"
              form="register-form"
              className="w-full bg-sunny text-espressoy rounded-full py-2 font-semibold hover:bg-orangey hover:text-white"
            >
              SIGN UP
            </button>

            <p className="text-sm mt-4 flex gap-1">
              Already a member?
              <Link
                to="/login"
                className="text-orangey underline hover:text-espressoy"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
