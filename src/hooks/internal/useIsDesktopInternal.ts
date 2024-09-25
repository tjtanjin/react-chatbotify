import { useMemo } from 'react';

export const useIsDesktopInternal = () => {
	const isDesktop = useMemo(() => {
		if (typeof window === 'undefined' || !window.navigator) {
			return false; // Default to false if running on server-side
		}
		return !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
	}, []);

	// boolean indicating if user is on desktop (otherwise treated as on mobile)
	return isDesktop;
};
