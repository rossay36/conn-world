import "./rightbar.css";
import { useEffect, useRef, useState } from "react";
import { IoIosGift } from "react-icons/io";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useAuth from "../../hooks/useAuth";
import { useGetUsersQuery } from "../../features/profile/usersApiSlice";
import Online from "../online/Online";

const HomeRightbar = () => {
	const [playingVideoIndex, setPlayingVideoIndex] = useState(null);
	const [fade, setFade] = useState(false);
	const { userId } = useAuth();

	const { user, isLoading, isError, error } = useGetUsersQuery("usersList", {
		selectFromResult: ({ data }) => ({
			user: data?.entities[userId],
		}),
	});

	const carouselRef = useRef(null);

	const handleVideoPlay = (index) => {
		setPlayingVideoIndex(index);
	};

	const handleVideoEnded = () => {
		setPlayingVideoIndex(null);
		if (carouselRef.current) {
			carouselRef.current.next();
		}
	};

	const handleBeforeChange = (oldIndex, newIndex) => {
		if (playingVideoIndex !== null && oldIndex === playingVideoIndex) {
			const videoElement = document.getElementById(
				`video-${playingVideoIndex}`
			);
			if (videoElement) {
				videoElement.pause();
			}
			setPlayingVideoIndex(null);
		}
	};

	useEffect(() => {
		if (fade) {
			const timer = setTimeout(() => setFade(false), 1000); // Match with CSS transition duration
			return () => clearTimeout(timer); // Cleanup timer
		}
	}, [fade]);

	return (
		<div className="rightbar">
			<div className="birthdayContainer">
				<IoIosGift className="birthdayImg" />
				<span className="birthdayText">
					<b>Pola Foster</b> and <b>3 other friends</b> have a birthday today.
				</span>
			</div>
			<div className="carousel_wrap">
				<Carousel
					ref={carouselRef}
					autoPlay={true}
					infiniteLoop
					showThumbs={false}
					showStatus={false}
					swipeable
					emulateTouch
					dynamicHeight
					transitionMode="fade"
					interval={600000} // Change this value to adjust the autoPlay interval
					transitionTime={700} // Transition duration in milliseconds
					onBeforeChange={handleBeforeChange}
				>
					<div className="carousel-slide">
						<img
							src="../../../src/assets/ad1.png"
							className="carousel_img"
							alt="Ad 1"
						/>
					</div>
					<div className="carousel-slide">
						<img
							src="../../../src/assets/ad3.png"
							className="carousel_img"
							alt="Ad 3"
						/>
					</div>
					<div className="carousel-slide">
						<img
							src="../../../src/assets/ad4.png"
							className="carousel_img"
							alt="Ad 4"
						/>
					</div>
				</Carousel>
			</div>
			<ul className="rightbarFriendList">
				<h4 className="rightbarTitle">Online Friends</h4>
				{user?.friends?.map((friendsId) => (
					<Online key={friendsId} friendsId={friendsId} />
				))}
			</ul>
		</div>
	);
};

export default HomeRightbar;
