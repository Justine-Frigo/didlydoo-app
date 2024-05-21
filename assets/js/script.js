// document.addEventListener("DOMContentLoaded", function () {
//   function loadEventsFromLocalStorage() {
//     const events = JSON.parse(localStorage.getItem("events")) || [];
//     events.forEach((e) => {
//       addTaskToDOM(e);
//     });
//   }

//   const addEvent = document.getElementById("addEvent");
//   addEvent.addEventListener("click", function (e) {
//     e.preventDefault();
//     const name = document.getElementById("eventName");
//     const description = document.getElementById("eventDescription");
//     const date = document.getElementById("eventDate");
//     const availability = document.getElementById("availability");

//     if (
//       name.value.trim() === "" ||
//       description.value.trim() === "" ||
//       availability.value === "null" ||
//       dateChoice.value.trim() === ""
//     ) {
//       alert("Please fill in all fields");
//       return;
//     }

//     const event = {
//       name: name.value,
//       description: description.value,
//       eventDate: date.value,
//       availability: availability.value,
//     };

//     addTaskToDOM(event);

//     saveEventsToLocalStorage();

//     alert("Great, your event has been created!");
//     name.value = "";
//     description.value = "";
//     availability.value = "";
//   });

//   let addEventBtn = document.getElementById("addEventBtn");
//   let form = document.querySelector("form");
//   let closeBtn = document.getElementById("closeBtn");
//   let display = false;

//   addEventBtn.addEventListener("click", function (e) {
//     e.preventDefault();
//     if (!display) {
//       form.style.visibility = "visible";
//       form.style.opacity = "1";
//       form.style.height = "auto";
//       form.style.padding = "5em";
//       display = "true";
//     }
//   });
//   closeBtn.addEventListener("click", function (e) {
//     e.preventDefault();
//     form.style.visibility = "hidden";
//     form.style.opacity = "0";
//     form.style.height = "0";
//     form.style.padding = "0";
//     display = false;

//     form.reset();
//   });
//   loadEventsFromLocalStorage();
// });
