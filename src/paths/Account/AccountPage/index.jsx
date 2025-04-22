import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/useUser";
import AdminTab from "./AccountTabs/AdminTab";
import BookingHistoryTab from "./AccountTabs/BookingHistoryTab";
import MyBookingsTab from "./AccountTabs/MyBookingsTab";
import EditAccountTab from "./AccountTabs/EditTab";
import ProfileTab from "./AccountTabs/ProfileTab";
import ShareProfileLink from "../../../components/Account/ShareProfileLink";

const AccountPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, name, avatar, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (isLoggedIn && username !== name) {
      navigate(`/account/${name}`, { replace: true });
    }
  }, [username, name, isLoggedIn, navigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Profile</h2>
              <ShareProfileLink />
            </div>
            <ProfileTab name={name} avatar={avatar} />
          </>
        );
  
      case "edit":
        return isLoggedIn ? <EditAccountTab /> : null;
      case "bookings":
        return isLoggedIn ? <MyBookingsTab /> : null;
      case "history":
        return isLoggedIn ? <BookingHistoryTab /> : null;
      case "admin":
        return isAdmin ? <AdminTab /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-creamy text-espressoy">
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex flex-wrap gap-4 border-b border-espressoy mb-4">
          <button
            className={`py-2 px-4 font-semibold ${
              activeTab === "profile" ? "text-goldy border-b-2 border-goldy" : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          {isLoggedIn && (
            <>
              <button
                className={`py-2 px-4 font-semibold ${
                  activeTab === "edit" ? "text-goldy border-b-2 border-goldy" : ""
                }`}
                onClick={() => setActiveTab("edit")}
              >
                Edit
              </button>
              <button
                className={`py-2 px-4 font-semibold ${
                  activeTab === "bookings" ? "text-goldy border-b-2 border-goldy" : ""
                }`}
                onClick={() => setActiveTab("bookings")}
              >
                My Bookings
              </button>
              <button
                className={`py-2 px-4 font-semibold ${
                  activeTab === "history" ? "text-goldy border-b-2 border-goldy" : ""
                }`}
                onClick={() => setActiveTab("history")}
              >
                Booking History
              </button>
            </>
          )}
          {isAdmin && (
            <button
              className={`py-2 px-4 font-semibold ${
                activeTab === "admin" ? "text-goldy border-b-2 border-goldy" : ""
              }`}
              onClick={() => setActiveTab("admin")}
            >
              Admin
            </button>
          )}
        </div>
        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AccountPage;
