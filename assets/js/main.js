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

const addEventBtn = document.getElementById("addEvent");
const closeBtn = document.getElementById("closeBtn");
const form = document.querySelector("form");
let display = false;

addEventBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!display) {
    form.style.visibility = "visible";
    form.style.height = "auto";
    form.style.opacity = "1";
    form.style.padding = "5em";
    display = "true";
    console.log(name.value);
    resetForm(name, author, description, dateInputValue);
  }
});

closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  form.style.visibility = "hidden";
  form.style.opacity = "0";
  form.style.height = "0";
  form.style.padding = "0";
  display = false;
});

async function displayEvents() {
  const events = await getAllEvents();
  const attendees = await getAllAttendees();
  console.log(attendees);

  const eventsContainer = document.getElementById("events-container");

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

    dates.forEach((date) => {
      const dateContainer = document.createElement("div");
      dateContainer.className = "date-availability";
      const dateValue = document.createElement("p");
      dateValue.innerText = new Date(date.date).toLocaleDateString("fr-FR");
      dateContainer.appendChild(dateValue);
      eventDates.appendChild(dateContainer);

      const attendees = date.attendees;

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

    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      if (confirm("Are you sure you want to delete this event?")) {
        await deleteEvent(event.id);
        await displayEvents();
      }
    });

    eventsContainer.appendChild(eventCard);
  });
}

const name = document.getElementById("eventName");
const author = document.getElementById("eventAuthor");
const description = document.getElementById("eventDescription");
const dateInputValue = document.getElementById("eventDate");

async function addNewEvent() {
  const datesArray = [];
  const date = new Date(dateInputValue.value);
  datesArray.push(date);
  console.log(datesArray);
  const availability = document.getElementById("availability");

  if (
    name.value.trim() === "" ||
    description.value.trim() === "" ||
    availability.value === "null" ||
    author.value.trim() === ""
  ) {
    alert("Please fill in all fields!");
    return;
  }

  try {
    await createEvent(name.value, datesArray, author.value, description.value);
  } catch (error) {
    console.error(error);
  }
}

const eventSubmitBtn = document.getElementById("eventSubmit");

eventSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  console.log(e);
  try {
    await addNewEvent();
    await displayEvents();
  } catch (error) {
    console.error(error);
  }
});

function resetForm(nameInput, authorInput, descriptionInput, dateInput) {
  nameInput.value = "";
  authorInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
}

await displayEvents();
