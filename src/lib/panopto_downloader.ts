export async function getVideo(videoId: string = "6a8db538-b80d-4021-abcf-b08900deccc1", encodedClientCredentials: string  = "2efe15d7-b4f2-4bf6-a9d4-b11400e67d0c:9+253mTRkuccwxbaw1uYCKUUUHSIB/0FyukdGtBLr0U=") {
    const apiUrl = `https://imperial.cloud.panopto.eu/api/v1/sessions/${videoId}`;
    const headers = new Headers();
    headers.append('Authorization', `Basic ${encodedClientCredentials}`);

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch video: ${response.statusText}`);
        }

        const videoData = await response.json();
        return videoData;
    } catch (error) {
        console.error('Error fetching video:', error);
        throw error;
    }
}