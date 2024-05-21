////////// GET //////////

import { getAllAttendees } from "./modules/GET/getAllAttendees";
import { getAllEvents } from "./modules/GET/getAllEvents";
import { getAttendeeByName } from "./modules/GET/getAttendeeByName";
import { getEventById } from "./modules/GET/getEventById";

////////// POST //////////
import { addAttendance } from "./modules/POST/addAttendance";
import { addDates } from "./modules/POST/addDates";
import { createEvent } from "./modules/POST/createEvent";

////////// PATCH //////////
import { updateAttendance } from "./modules/PATCH/updateAttendance";
import { updateEvent } from "./modules/PATCH/updateEvent";

////////// DELETE //////////
import { deleteEvent } from "./modules/DELETE/deleteEvent";