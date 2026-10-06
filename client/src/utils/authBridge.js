// Lets modules outside the React tree (like axiosClient's interceptor) trigger
// a logout + SPA navigation instead of a hard window.location reload, which
// would otherwise discard whatever the user had in progress elsewhere.
let logoutHandler = null;
let navigateHandler = null;

export const registerLogoutHandler = (fn) => {
  logoutHandler = fn;
};

export const registerNavigateHandler = (fn) => {
  navigateHandler = fn;
};

export const forceLogout = () => {
  if (logoutHandler) {
    logoutHandler();
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  if (navigateHandler) {
    navigateHandler("/login", { replace: true });
  } else {
    window.location.href = "/login";
  }
};
