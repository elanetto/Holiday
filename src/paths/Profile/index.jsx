import { useParams } from "react-router-dom";
import ProfileTab from "../Account/AccountPage/AccountTabs/ProfileTab";

const ProfilePage = () => {
  const { username } = useParams();

  return (
    <div className="p-8 text-center w-full">
      <ProfileTab name={username} />
    </div>
  );
};

export default ProfilePage;
