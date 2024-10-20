import { useMemo } from 'react';

export const useIsDesktopInternal = () => {
	const isDesktop = useMemo(() => {
		if (typeof window === 'undefined' || !window.navigator) {
			return false; // Default to false if running on server-side
		}
		const userAgent = navigator.userAgent;
		const isNotMobileUA = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent));
		const isWideEnough = window.innerWidth >= 768;

		// device is desktop if it is not a mobile agent and if the width is wide enough
		return isNotMobileUA && isWideEnough;
	}, []);

	// boolean indicating if user is on desktop (otherwise treated as on mobile)
	return isDesktop;
};
