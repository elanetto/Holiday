import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/useUser";
import BookingHistoryTab from "./AccountTabs/BookingHistoryTab";
import MyBookingsTab from "./AccountTabs/MyBookingsTab";
import EditAccountTab from "./AccountTabs/EditTab";
import ProfileTab from "./AccountTabs/ProfileTab";
import ShareProfileLink from "../../../components/Account/ShareProfileLink";
import MyVenuesList from "../../../components/Account/MyVenuesList";
import VenueForm from "../../../components/Account/VenueForm";
import axios from "axios";
import { ENDPOINTS } from "../../../utilities/constants";
import { Menu, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const AccountPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, name, avatar, isAdmin } = useUser();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "profile";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [becomingManager, setBecomingManager] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isLoggedIn && username !== name) {
      navigate(`/account/${name}`, { replace: true });
    }
  }, [username, name, isLoggedIn, navigate]);

  const handleBecomeManager = async () => {
    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("apiKey");

    try {
      setBecomingManager(true);
      await axios.put(
        `${ENDPOINTS.profiles}/${name}`,
        { venueManager: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      localStorage.setItem("isAdmin", true);
      window.location.reload();
    } catch (error) {
      console.error("Failed to become venue manager:", error);
    } finally {
      setBecomingManager(false);
    }
  };

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
      case "venues":
        return isAdmin ? <MyVenuesList /> : null;
      case "new":
        return isAdmin ? <VenueForm mode="create" /> : null;
      case "become":
        return (
          <div className="text-center p-8">
            <h2 className="text-xl font-bold mb-4">Become a Venue Manager</h2>
            <p>As a Venue Manager you can host your own venues,</p>
            <p>free of charge.</p>
            <button
              onClick={handleBecomeManager}
              disabled={becomingManager}
              className="bg-sunny text-espressoy mt-6 font-semibold py-2 px-6 rounded-full hover:bg-orangey hover:text-white transition"
            >
              {becomingManager ? "Becoming..." : "Yes, make me a manager!"}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { key: "profile", label: "Profile" },
    ...(isLoggedIn
      ? [
          { key: "edit", label: "Edit" },
          { key: "bookings", label: "My Bookings" },
          { key: "history", label: "Booking History" },
          !isAdmin && { key: "become", label: "Become a Venue Manager" },
        ].filter(Boolean)
      : []),
    ...(isAdmin
      ? [
          { key: "venues", label: "My Venues" },
          { key: "new", label: "Add New Venue" },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen text-espressoy bg-creamy">
      <div className="max-w-4xl mx-auto py-8">
        <div className="sm:hidden mb-4 flex justify-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center px-4 py-2 rounded-full text-espressoy bg-sunny"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 mr-2" />
            ) : (
              <Menu className="w-5 h-5 mr-2" />
            )}
            My Account
          </button>
          {mobileMenuOpen && (
            <div className="mt-2 flex flex-col gap-2 border-t border-espressoy pt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setMobileMenuOpen(false);
                  }}
                  className={`py-2 font-semibold ${
                    activeTab === tab.key ? "text-orangey" : ""
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden sm:flex flex-wrap gap-4 border-b border-espressoy mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`py-2 px-4 font-semibold ${
                activeTab === tab.key
                  ? "text-orangey border-b-2 border-orangey"
                  : ""
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AccountPage;
