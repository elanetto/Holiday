import { useState } from "react";
import { useUser } from "../../../contexts/useUser";
import AdminTab from "./AccountTabs/AdminTab";
import BookingHistoryTab from "./AccountTabs/BookingHistoryTab";
import MyBookingsTab from "./AccountTabs/MyBookingsTab";
import EditAccountTab from "./AccountTabs/EditTab";
import ProfileTab from "./AccountTabs/ProfileTab";

const AccountPage = () => {
  const { isLoggedIn, name, avatar, isAdmin } = useUser();
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab name={name} avatar={avatar} />;
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
