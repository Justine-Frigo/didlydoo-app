export async function deleteEvent(eventId) {
    try {
        const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            }, 
        })
        const data = await response.json();
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}