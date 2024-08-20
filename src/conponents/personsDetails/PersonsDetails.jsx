import Leftbar from "../leftbar/Leftbar";
import Rigthbar from "../rightbar/Rigthbar";
import EditAddress from "./EditAddress";
import EditCurrentLive from "./EditCurrentLive";
import EditEducation from "./EditEducation";
import EditPersonalDetails from "./EditPersonalDetails";
import "./personsDetails.css";

const PersonsDetails = () => {
	return (
		<div className="personsDetails">
			<div className="personsDetails_leftbar">
				<Leftbar />
			</div>
			<div className="personsDetails_container">
				<h1 className="personsDetails_title">Personal info</h1>
				<hr className="hr"></hr>
				<EditAddress />
				<hr className="hr"></hr>
				<EditCurrentLive />
				<hr className="hr"></hr>
				<EditEducation />
				<hr className="hr"></hr>
				<EditPersonalDetails />
			</div>
		</div>
	);
};

export default PersonsDetails;
