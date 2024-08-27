export const saveToLocalStorage = (key, value) => {
	localStorage.setItem(key, JSON.stringify(value));
};

export const getFromLocalStorage = (key) => {
	const data = localStorage.getItem(key);
	return data ? JSON.parse(data) : {};
};
