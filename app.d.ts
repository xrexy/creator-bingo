// app.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./src/server/lucia").Auth;
	type DatabaseUserAttributes = {};
	type DatabaseSessionAttributes = {};
}