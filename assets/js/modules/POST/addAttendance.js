export async function addAttendance(eventId, name, dates, availability) {
    const attendance = {
        name: name,
        dates: dates,
        availability: availability
    }

    try {
        const response = await fetch(`http://localhost:3000/api/events/${eventId}/attend`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(attendance)
        })

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}