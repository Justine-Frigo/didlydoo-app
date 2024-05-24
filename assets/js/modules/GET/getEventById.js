export async function getEventById(eventId) {
    try {
        const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}