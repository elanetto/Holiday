import AvatarEditor from '../../../../components/Account/AvatarEditor';
import BannerEditor from '../../../../components/Account/BannerEditor';
import BioEditor from '../../../../components/Account/BioEditor';

const EditAccountTab = () => {
  return (
    <div className="p-8 text-center w-full space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-espressoy">Edit</h1>
        <p className="text-gray-700">This is where you can edit your user avatar, banner and bio.</p>
      </div>

      <AvatarEditor />

      <hr className="border-t border-gray-300 my-4" />

      <BannerEditor />

      <hr className="border-t border-gray-300 my-4" />

      <BioEditor />
    </div>
  );
};

export default EditAccountTab;
