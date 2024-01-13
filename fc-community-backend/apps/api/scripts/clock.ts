import { CronJob } from "cron";
import { finaliseNotes } from "./finaliseNotes";

new CronJob(
	"0 0 */20 * * *", // runs every 20 hours
	function () {
		console.log("Note Finalisation and NFTs mint launched! Running every 20 hours");
        // finalise all notes from 24 hours old (1 day)
        // with at least 1 rating
        finaliseNotes(1,1);
	},
	null, // do nothing when job is intentionally halted
	true, // starts the job before leaving the constructor
	"Europe/Paris",  
);

