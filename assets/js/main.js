////////// GET //////////
import { getAllAttendees } from "./modules/GET/getAllAttendees.js";
import { getAllEvents } from "./modules/GET/getAllEvents.js";
import { getAttendeeByName } from "./modules/GET/getAttendeeByName.js";
import { getEventById } from "./modules/GET/getEventById.js";

////////// POST //////////
import { addAttendance } from "./modules/POST/addAttendance.js";
import { addDates } from "./modules/POST/addDates.js";
import { createEvent } from "./modules/POST/createEvent.js";

////////// PATCH //////////
import { updateAttendance } from "./modules/PATCH/updateAttendance.js";
import { updateEvent } from "./modules/PATCH/updateEvent.js";

////////// DELETE //////////
import { deleteEvent } from "./modules/DELETE/deleteEvent.js";

/////////  DARKMODE ////////
import { darkMode } from "./darkmode.js";

////////// VARIABLES / DOM ELEMENTS //////////
const addEventBtn = document.getElementById("addEvent");
const closeBtn = document.getElementById("closeBtn");
const form = document.querySelector("form");
const name = document.getElementById("eventName");
const author = document.getElementById("eventAuthor");
const description = document.getElementById("eventDescription");
const dateInputValue = document.getElementById("eventDate");
const addDateBtn = document.getElementById("addDateBtn");
const datesContainer = document.getElementById("datesContainer");
const eventSubmitBtn = document.getElementById("eventSubmit");
let display = false;
let datesArray = [];

// DARK MODE SWITCH
darkMode();

// FORM OPENING
addEventBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!display) {
    form.style.visibility = "visible";
    form.style.height = "auto";
    form.style.opacity = "1";
    form.style.padding = "5em";
    display = true;
    resetForm(name, author, description, dateInputValue);
  }
});

// FORM CLOSING
closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.style.visibility = "hidden";
  form.style.opacity = "0";
  form.style.height = "0";
  form.style.padding = "0";
  display = false;
});

let currentEventId = null;

// DISPLAYING EVENTS AS CARDS
async function displayEvents() {
  const events = await getAllEvents();
  const attendees = await getAllAttendees();
  console.log("Events after update:", events);
  console.log(attendees);

  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = ''; //Clear the container before displaying events

  // Looping over each event to create a card for each
  events.forEach((event) => {
    const eventCard = document.createElement("article");
    const eventCardHeader = document.createElement("section");
    eventCardHeader.className = "event-header";
    eventCard.appendChild(eventCardHeader);

    const eventName = document.createElement("h2");
    eventName.innerText = event.name;
    eventCardHeader.appendChild(eventName);

    const eventDescription = document.createElement("p");
    eventDescription.innerText = event.description;
    eventCard.appendChild(eventDescription);

    const eventDates = document.createElement("div");
    eventDates.className = "dates-container";

    const dates = event.dates;

    // Looping over each date to append them to their container
    dates.forEach((date) => {
      const dateContainer = document.createElement("div");
      dateContainer.className = "date-availability";
      const dateValue = document.createElement("p");
      dateValue.innerText = new Date(date.date).toLocaleDateString("fr-FR");
      dateContainer.appendChild(dateValue);
      eventDates.appendChild(dateContainer);

      const attendees = date.attendees;

      // Looping over each attendee to append them to the date container
      attendees.forEach((attendee) => {
        const attendeeContainer = document.createElement("p");
        attendeeContainer.innerText = attendee.name;
        attendeeContainer.className = attendee.available
          ? "available"
          : "unavailable";

        dateContainer.appendChild(attendeeContainer);
      });
    });
    eventCard.appendChild(eventDates);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.innerText = "Delete event";
    eventCard.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.className = "editBtn";
    editBtn.innerText = "Edit event";
    eventCard.appendChild(editBtn);

    // Triggering a confirm box before deleting the event
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (confirm("Are you sure you want to delete this event?")) {
        await deleteEvent(event.id);
        await displayEvents();
      }
    });

    editBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openEditForm(event);
    });

    eventsContainer.appendChild(eventCard);
  });
}

// Add date to the list
addDateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const dateValue = dateInputValue.value;
  if (dateValue) {
    datesArray.push(new Date(dateValue));
    displayDates();
  }
});

function displayDates() {
  datesContainer.innerHTML = '';
  datesArray.forEach((date, index) => {
    const dateDiv = document.createElement("div");
    dateDiv.innerText = date.toLocaleDateString("fr-FR");
    const removeBtn = document.createElement("button");
    removeBtn.innerText = "Remove";
    removeBtn.addEventListener("click", () => {
      datesArray.splice(index, 1);
      displayDates();
    });
    dateDiv.appendChild(removeBtn);
    datesContainer.appendChild(dateDiv);
  });
}

function openEditForm(event) {
  form.style.visibility = "visible";
  form.style.height = "auto";
  form.style.opacity = "1";
  form.style.padding = "5em";
  display = true;

  name.value = event.name;
  author.value = event.author;
  description.value = event.description;
  datesArray = event.dates.map(date => new Date(date.date));
  displayDates();

  currentEventId = event.id;
  eventSubmitBtn.innerText = "Update Event";

  console.log("Editing event:", event);
}

// Creating a new event
async function addNewEvent() {
  const availability = document.getElementById("availability");

  // Sanitizing inputs
  if (
    name.value.trim() === "" ||
    description.value.trim() === "" ||
    availability.value === "null" ||
    author.value.trim() === "" ||
    datesArray.length === 0
  ) {
    alert("Please fill in all fields and add at least one date!");
    return;
  }

  try {
    // Actually calling the API to create an event
    await createEvent(name.value, datesArray, author.value, description.value);
  } catch (error) {
    console.error(error);
  }
}

// Event listener to fire the API call
eventSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    if (currentEventId) {
      console.log("Submitting update for event id:", currentEventId);
      console.log("Values to update:", {
        name: name.value,
        author: author.value,
        description: description.value,
        dates: datesArray,
      });
      await patchEvent(
        currentEventId,
        name.value,
        author.value,
        description.value,
        datesArray
      );
    } else {
      await addNewEvent();
    }
    resetForm(name, author, description, dateInputValue);
    form.style.visibility = "hidden";
    form.style.opacity = "0";
    form.style.height = "0";
    form.style.padding = "0";
    display = false;
    await displayEvents();
  } catch (error) {
    console.error("Error submitting form:", error);
  }
});

// Updating/patching an event
async function patchEvent(eventId, name, author, description, dates) {
  try {
    console.log("Updating event with id:", eventId);
    console.log("New values:", { name, author, description, dates });
    await updateEvent(eventId, name, dates, author, description);
  } catch (error) {
    console.error("Failed to update event:", error);
  }
}

// Resetting the form to its original state
function resetForm(nameInput, authorInput, descriptionInput, dateInput) {
  nameInput.value = "";
  authorInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  datesArray = [];
  datesContainer.innerHTML = '';
  currentEventId = null;
  eventSubmitBtn.innerText = "Create Event";
}

// Initial load of events
document.addEventListener("DOMContentLoaded", async () => {
  await displayEvents();
});