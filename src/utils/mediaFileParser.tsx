/**
 * Retrieves details of a file (only for image, video and audio) which consists of its type and URL.
 *
 * @param file file object to get details from
 */
export const getMediaFileDetails = async (file: File): Promise<{ fileType: string | null, fileUrl: string | null }> => {
	if (!file) {
		return { fileType: null, fileUrl: null };
	}

	const fileType = file.type.split("/")[0];

	if (!["image", "video", "audio"].includes(fileType)) {
		return { fileType: null, fileUrl: null };
	}

	try {
		const fileUrl = await new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("File reading failed"));
			reader.readAsDataURL(file);
		});

		return { fileType, fileUrl };
	} catch (error) {
		return { fileType: null, fileUrl: null };
	}
};