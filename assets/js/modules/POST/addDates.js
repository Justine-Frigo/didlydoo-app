export async function addDates(eventId, dates) {
    try {
        const dataDates = {dates}
        const response = await fetch(`http://localhost:3000/api/events/${eventId}/add_dates`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(dataDates)
        })

        return response.json()
    } catch (error) {
        console.error(error)
    }
}