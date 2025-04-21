import AvatarEditor from '../../../../components/Account/AvatarEditor';
import BannerEditor from '../../../../components/Account/BannerEditor';
import BioEditor from '../../../../components/Account/BioEditor';

const EditAccountTab = () => {

    return (
        <div className="p-8 text-center w-full">
            <h1>Edit</h1>
            <p>This is where you can edit your user avatar and banner.</p>

            <AvatarEditor />
            <BannerEditor />
            <BioEditor />
        </div>
    );
};

export default EditAccountTab;