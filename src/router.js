import express from "express";
import {createUser} from "./controllers/createUser.js";
import {getUser} from "./controllers/getUser.js";
import {getJob} from "./controllers/getJob.js";
import {addEducation} from "./controllers/user-data/add/addEducation.js";
import {addProject} from "./controllers/user-data/add/addProjects.js";
import {addExperience} from "./controllers/user-data/add/addExperience.js";
import {updateInfo} from "./controllers/user-data/update/update-info.js";
import {updateEducation} from "./controllers/user-data/update/updateEducation.js";
import {updateExperience} from "./controllers/user-data/update/updateExperience.js";
import {updateProjects} from "./controllers/user-data/update/updateProjects.js";
import {removeEducation} from "./controllers/user-data/remove/removeEducation.js";
import {removeExperience} from "./controllers/user-data/remove/removeExperience.js";
import {removeProjects} from "./controllers/user-data/remove/removeProjects.js";
import {updateSkills} from "./controllers/user-data/update/update-skills.js";
import {updatePreferences} from "./controllers/user-data/update/updatePreferences.js";
import {updatePhone} from "./controllers/user-data/update/updatePhone.js";
import {saveJob} from "./controllers/saveJob.js";
import {removeSaved} from "./controllers/removeSaved.js";
import {getSavedJobs} from "./controllers/getSavedJobs.js";

const router = express.Router();

router.get("/get-user/:id", getUser);
router.get("/get-job/:id/:uid", getJob);
router.get("/saved/:id", getSavedJobs);
router.post("/create-user", createUser);
router.post("/add-education", addEducation);
router.post("/add-experience", addExperience);
router.post("/add-projects", addProject);
router.post("/update-info", updateInfo);
router.post("/update-skills", updateSkills);
router.post("/update-preferences", updatePreferences);
router.post("/update-phone", updatePhone);
router.post("/update-education", updateEducation);
router.post("/update-experience", updateExperience);
router.post("/update-project", updateProjects);
router.post("/remove-education", removeEducation);
router.post("/remove-experience", removeExperience);
router.post("/remove-projects", removeProjects);
router.post("/save-job", saveJob);
router.patch("/unsave", removeSaved);

export default router;
