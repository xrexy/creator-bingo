// app.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./src/server/lucia").Auth;
	type DatabaseUserAttributes = {
		username: string;
		avatar: string;
	};
	type DatabaseSessionAttributes = {
	};
}