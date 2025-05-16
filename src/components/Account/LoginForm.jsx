import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { ENDPOINTS } from "../../utilities/constants";
import { useUser } from "../../contexts/useUser";
import { launchConfetti } from "../../utilities/confetti";
import { useLocation } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const location = useLocation();
  const from = location.state?.from?.pathname || `/account/${name}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formError, setFormError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!/^\S+@stud\.noroff\.no$/.test(email)) {
      newErrors.email = "Must be a valid stud.noroff.no email";
    }
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    return newErrors;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateForm();
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setFormError("");

    try {
      const res = await axios.post(`${ENDPOINTS.login}?_holidaze=true`, {
        email,
        password,
      });

      const { accessToken, venueManager, name, avatar } = res.data.data;

      const apiRes = await axios.post(
        ENDPOINTS.api_key,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const apiKey = apiRes.data.data.key;

      loginUser({
        token: accessToken,
        name,
        email,
        isVenueManager: venueManager,
        avatar: avatar?.url,
        apiKey,
      });

      toast.success("Logged in successfully 🎉");
      launchConfetti();
      navigate(from || `/account/${encodeURIComponent(name)}`, {
        replace: true,
      });
    } catch (err) {
      console.error("Login error:", err);
      setFormError("Login failed. Check your email and password.");
    }
  };

  return (
    <div className="flex justify-center text-center mt-10 sm:mt-16">
      <div className="bg-creamy p-8 rounded-3xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-espressoy mb-2">LOG IN</h1>

        <form onSubmit={handleLogin} className="space-y-4 text-left">
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
                className={`w-full border bg-white p-2 pr-10 rounded focus:outline-none transition-colors duration-300 ${
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

          {formError && <p className="text-error text-sm">{formError}</p>}

          <button
            type="submit"
            className="w-full bg-sunny text-espressoy rounded-full py-2 font-semibold hover:bg-orangey hover:text-white"
          >
            LOG IN
          </button>
        </form>

        <p className="text-sm mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-orangey underline hover:text-espressoy"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
