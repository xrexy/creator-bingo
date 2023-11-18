// --- Action Errors

export enum ActionError {
  "UNAUTHENTICATED" = "UNAUTHENTICATED",
  "NOTHING_CHANGED" = "NOTHING_CHANGED",
  "NO_REFRESH_TOKEN" = "NO_REFRESH_TOKEN",
  "UNKNOWN" = "UNKNOWN",
}

export type ActionErrorType = typeof ActionError;
export type ActionErrorKeys = keyof ActionErrorType;

export const actionErrorMessages = {
  [ActionError.UNAUTHENTICATED]: "You are not logged in.",
  [ActionError.NOTHING_CHANGED]: "Nothing changed.",
  [ActionError.UNKNOWN]: "An unknown error occurred, please try again later.",
  [ActionError.NO_REFRESH_TOKEN]: "No refresh token found. This is likely a bug, please report it or regenerate it from the Tokens Settings page.",
} as const satisfies Record<ActionError, string>;

export const isValidActionError = (error: unknown): error is ActionError => {
  return typeof error === "string" && Object.values(ActionError).includes(error as ActionError);
}

export const isValidActionErrorOrDefault = (error: unknown, def: ActionErrorKeys): ActionError => {
  return isValidActionError(error) ? error : ActionError[def];
}

// --- Search Param Errors

export enum SearchParamError {
  "NO_CHANNEL" = "channel",
  "INSERT_FAILED" = "insert",
  "UPDATE_FAILED" = "update",
  "OAUTH_UNKOWN" = "oauth",
  "UNKNOWN" = "unknown",
}

export type SearchParamErrorType = typeof SearchParamError;
export type SearchParamErrorKeys = keyof SearchParamErrorType;

export const searchParamErrorMesssages = {
  [SearchParamError.NO_CHANNEL]: "The account you are trying to link does not have a channel.",
  [SearchParamError.INSERT_FAILED]: "An error occurred while saving, please try again later.",
  [SearchParamError.UPDATE_FAILED]: "An error occurred while updating, please try again later.",
  [SearchParamError.OAUTH_UNKOWN]: "An error occurred while authenticating, please try again later.",
  [SearchParamError.UNKNOWN]: "An unknown error occurred, please try again later.",
} as const satisfies Record<SearchParamError, string>;

export const isValidSearchParamError = (error: unknown): error is SearchParamError => {
  return typeof error === "string" && Object.values(SearchParamError).includes(error as SearchParamError);
}

export const isValidSearchParamErrorOrDefault = (error: unknown, def: SearchParamErrorKeys): SearchParamError => {
  return isValidSearchParamError(error) ? error : SearchParamError[def];
}