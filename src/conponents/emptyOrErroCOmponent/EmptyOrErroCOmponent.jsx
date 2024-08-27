import "./EmptyOrErroCOmponent.css";

const EmptyOrErroCOmponent = ({ title, icon, icons, desc }) => {
	return (
		<div className="emptyOrErroCOmponent">
			<div className="emptyOrErroCOmponent_container">
				<h1 className="emptyOrErroCOmponent_txt">{title}</h1>
				<p className="emptyOrErroCOmponent_icon">{icon}</p>
				<p className="emptyOrErroCOmponent_decs">{desc}</p>
				<p className="emptyOrErroCOmponent_icons">{icons}</p>
			</div>
		</div>
	);
};

export default EmptyOrErroCOmponent;
