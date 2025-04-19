import { useUser } from "../../../../contexts/useUser";
import { PLACEHOLDER_AVATAR, PLACEHOLDER_BANNER } from "../../../../utilities/placeholders";

const ProfileTab = () => {
  const { name, avatar } = useUser();

  return (
    <div className="p-8 text-center w-full">
      <h1>Profile</h1>
      <p>This is the main profile page: Everyone can see this.</p>
      <div className="p-4">
        <h2 className="text-xl font-bold">Account Details</h2>
        <img
            src={avatar || PLACEHOLDER_AVATAR}
            alt="User avatar"
            className="w-24 h-24 rounded-full border border-espressoy mt-2"
        />
        <p className="mt-2 font-semibold">{name}</p>
        {/* Add bio and banner here */}
      </div>
    </div>
  );
};

export default ProfileTab;
