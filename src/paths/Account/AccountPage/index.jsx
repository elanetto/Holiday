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
import { toast } from "react-hot-toast";

const AccountPage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, name, email, avatar, loginUser, isVenueManager } =
    useUser();

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "profile"
  );

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

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

      loginUser({
        token,
        name,
        email,
        isVenueManager: true,
        avatar,
      });

      toast.success("You are now a venue manager! 🏡✨");

      navigate(`/account/${name}?tab=venues`, { replace: true });
    } catch (error) {
      console.error("Failed to become venue manager:", error);
      toast.error("Failed to become venue manager. Please try again.");
    } finally {
      setBecomingManager(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <div className="flex flex-col justify-center items-center sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 text-left">
              <ShareProfileLink />
              <h2 className="text-xl font-bold text-espressoy">My Profile</h2>
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
        return isVenueManager ? <MyVenuesList /> : null;
      case "new":
        return isVenueManager ? <VenueForm mode="create" /> : null;
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
          !isVenueManager && { key: "become", label: "Become a Venue Manager" },
        ].filter(Boolean)
      : []),
    ...(isVenueManager
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
                    navigate(`?tab=${tab.key}`);
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
              onClick={() => {
                navigate(`?tab=${tab.key}`);
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

        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default AccountPage;
