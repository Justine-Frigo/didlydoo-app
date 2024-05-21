export async function getAllEvents() {
    try {
        const response = await fetch(`http://localhost:3000/api/events`)
        return await response.json();
    } catch (error) {
        console.error(error)
        return null;
    }
} 