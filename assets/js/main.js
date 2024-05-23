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

///////// DARKMODE ////////
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
  clearErrorMessages();
});

let currentEventId = null;

// DISPLAYING EVENTS AS CARDS
async function displayEvents() {
  const events = await getAllEvents();
  const attendees = await getAllAttendees();

  const eventsContainer = document.getElementById("events-container");
  eventsContainer.innerHTML = ''; //Clear the container before displaying events

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
      const newAttendee = document.createElement("div");
      newAttendee.className = "addAttendee";
      const present = document.createElement("input");
      present.className = "available";
      present.setAttribute("type", "checkbox")
      newAttendee.appendChild(present);
      const absence = document.createElement("input");
      absence.className = "unavailable";
      absence.setAttribute("type", "checkbox")
      newAttendee.appendChild(absence);
      newAttendee.setAttribute("style","display:none");
      dateContainer.appendChild(newAttendee);
    });
    eventCard.appendChild(eventDates);

    const newAttendeeName = document.createElement("input");
    newAttendeeName.className = "addAttendee";
    newAttendeeName.setAttribute("style","display:none");
    eventCard.appendChild(newAttendeeName);

    const addAttendeeBtn = document.createElement("button");
    addAttendeeBtn.className = "addAttendeeBtn";
    addAttendeeBtn.innerText = "add attendance";
    eventCard.appendChild(addAttendeeBtn);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.innerText = "Delete event";
    eventCard.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.className = "editBtn";
    editBtn.innerText = "Edit event";
    eventCard.appendChild(editBtn);

    addAttendeeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      changeVisibility("addAttendee");
    })

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

//change visibility
function changeVisibility (elemName){
  let element = document.getElementsByClassName(elemName);
  element.foreach(elem => {
    elem.style.display = "block";
  })
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

async function addNewEvent() {
  if (validateForm()) {
    try {
      await createEvent(name.value.trim(), datesArray, author.value.trim(), description.value.trim());
      resetForm(name, author, description, dateInputValue);
      form.style.visibility = "hidden";
      form.style.opacity = "0";
      form.style.height = "0";
      form.style.padding = "0";
      display = false;
      await displayEvents();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  }
}

eventSubmitBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  if (validateForm()) {
    try {
      if (currentEventId) {
        await patchEvent(currentEventId, name.value.trim(), author.value.trim(), description.value.trim(), datesArray);
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
  }
});

async function patchEvent(eventId, name, author, description, dates) {
  try {
    await updateEvent(eventId, name, author, description);
    if (dates) {
      await addDates(eventId, dates);
    }
  } catch (error) {
    console.error("Failed to update event:", error);
  }
}

function resetForm(nameInput, authorInput, descriptionInput, dateInput) {
  nameInput.value = "";
  authorInput.value = "";
  descriptionInput.value = "";
  dateInput.value = "";
  datesArray = [];
  datesContainer.innerHTML = '';
  currentEventId = null;
  eventSubmitBtn.innerText = "Create Event";
  clearErrorMessages();
}

async function addAttendanceToEvent(eventId, name, dates, availability) {
  try {
    return await addAttendance(eventId, name, dates, availability);
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await displayEvents();
});

function validateForm() {
  clearErrorMessages();
  let valid = true;

  if (name.value.trim() === "") {
    showError("name", "Le nom de l'événement est requis.", name);
    valid = false;
  }

  if (author.value.trim() === "") {
    showError("author", "L'auteur est requis.", author);
    valid = false;
  }

  if (description.value.trim() === "") {
    showError("description", "La description est requise.", description);
    valid = false;
  }

  if (datesArray.length === 0) {
    showError("date", "Veuillez ajouter au moins une date.", dateInputValue);
    valid = false;
  }

  return valid;
}

function showError(field, message, input) {
  const errorElement = document.getElementById(`${field}Error`);
  if (errorElement) {
    input.style.border = '1px solid rgb(241, 41, 101)';
    errorElement.innerText = message;
    errorElement.style.display = "block";
  }
}

function clearErrorMessages() {
  const errorElements = document.querySelectorAll(".error-slot");
  const inputsArray = [
    name,
    author, 
    description,
    dateInputValue 
  ]

  errorElements.forEach(element => {
    element.innerText = "";
    element.style.display = "none";
  });

  inputsArray.forEach(element => {
    element.style.border = 'none'
  })
}
