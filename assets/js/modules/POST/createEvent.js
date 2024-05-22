export async function createEvent(name, dates, author, description) {
    const event = {
        name: name,
        dates: datesArray.map(date => ({ date: date.toISOString() })),
        author: author,
        description: description
    }
    
    try {
        const response = await fetch(`http://localhost:3000/api/events`, {
            method: 'POST',
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
