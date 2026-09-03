import * as dbUser from "./soupabase/user.js";

const {
	user,
	error,
} = await dbUser.getLoggedUser();

if (error || !user) {
    console.log("Not logged in")
	window.location.href = "/login";
}


console.log("Logged in user:", user.email);
