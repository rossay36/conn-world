import { useAddNewCommentMutation } from "../features/homes/commentApiSlice";

const useButton = () => {
	const [addComment, { isLoading, error }] = useAddNewCommentMutation();

	const handleAddComment = async ({ user, post, desc, commentImage }) => {
		try {
			await addComment({ user, post, desc, commentImage });
			console.log("Comment added successfully!");
		} catch (error) {
			console.error("Error adding comment:", error);
		}
	};

	return { handleAddComment, isLoading, error };
};

export default useButton;
