export async function updateEvent(eventId, name, author, description) {
    const event = {
        name: name,
        dates: dates,
        author: author,
        description: description
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/events/${eventId}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(event)
        })
        const data = await response.json();
        console.log(data)
    } catch (error) {
        console.error(error)
    }
}