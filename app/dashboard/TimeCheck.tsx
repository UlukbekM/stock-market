import { useEffect } from 'react';

const checkAndRemoveSavedDate = (callback: () => void): void => {
    useEffect(() => {
    // Retrieve savedDate from localStorage
    const savedDateStr = localStorage.getItem('savedDate');

    if (savedDateStr) {
        const savedDate = new Date(savedDateStr);

      // Get the current date and time
        const currentDate = new Date();

      // Check if it's past 9 AM
        if (currentDate.getHours() >= 9) {
        // Remove savedDate from localStorage
            localStorage.removeItem('savedDate');

            callback();
        }
    }
  }, [callback]); // Include the callback function in the dependency array to avoid stale closures
};

export default checkAndRemoveSavedDate;
