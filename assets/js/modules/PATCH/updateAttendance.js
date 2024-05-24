export async function updateAttendance(eventId, name, dates) {
    console.log(dates)
  try {
    const response = await fetch(
      `http://localhost:3000/api/events/${eventId}/attend`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          dates,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
