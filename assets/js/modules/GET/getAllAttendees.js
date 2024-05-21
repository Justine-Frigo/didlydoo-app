export async function getAllAttendees() {
  try {
    const response = await fetch(`http://localhost:3000/api/attendees`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
