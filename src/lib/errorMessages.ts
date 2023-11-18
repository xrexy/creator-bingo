// --- Action Errors

export const actionErrors = ["UNAUTHENTICATED", 'NOTHING_CHANGED', 'UNKNOWN'] as const;
export type ActionError = typeof actionErrors[number];

export const actionError = actionErrors.reduce((acc, cur) => {
  acc[cur] = cur;
  return acc;
}, {} as Record<ActionError, ActionError>);

export const actionErrorMessages = {
  UNAUTHENTICATED: "You are not logged in.",
  NOTHING_CHANGED: "Nothing changed.",
  UNKNOWN: "An unknown error occurred, please try again later.",
} as const satisfies Record<ActionError, string>;

export const isValidActionError = (error: unknown): error is ActionError => {
  return typeof error === "string" && actionErrors.includes(error as ActionError);
}

export const isValidActionErrorOrDefault = (error: unknown, def: ActionError): ActionError => {
  return isValidActionError(error) ? error : def;
}

// --- Search Param Errors

export const searchParamErrors = ["channel", 'insert', 'oauth', 'unknown'] as const;
export type SearchParamError = typeof searchParamErrors[number];

export const searchParamError = searchParamErrors.reduce((acc, cur) => {
  acc[cur] = cur;
  return acc;
}, {} as Record<SearchParamError, SearchParamError>);

export const searchParamErrorMesssages = {
  channel: "The account you are trying to link does not have a channel.",
  insert: "An error occurred while saving, please try again later.",
  oauth: "An error occurred while authenticating, please try again later.",
  unknown: "An unknown error occurred, please try again later.",
} as const satisfies Record<SearchParamError, string>;

export const isValidSearchParamError = (error: unknown): error is SearchParamError => {
  return typeof error === "string" && searchParamErrors.includes(error as SearchParamError);
}

export const isValidSearchParamErrorOrDefault = (error: unknown, def: SearchParamError): SearchParamError => {
  return isValidSearchParamError(error) ? error : def;
}