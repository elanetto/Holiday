import VenueForm from "../../../../components/Account/VenueForm";

const AdminTab = () => {

    return (
        <div className="p-8 text-center w-full">
            <h1>Admin</h1>
            <p>This is where the Venue Manager.... manages....venues</p>

            <VenueForm />
        </div>
    );
};

export default AdminTab;