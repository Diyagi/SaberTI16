import * as dbUser from "./soupabase/user.js";

const {
	data: { user },
	error,
} = await dbUser.getUser();

if (error || !user) {
    console.log("Not logged in")
	window.location.href = "/login";
}

console.log("Logged in user: ", user.email);
