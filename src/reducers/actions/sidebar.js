import { TOGGLE_SIDEBAR } from "../constants";

export const toggleSidebar = () => (dispatch) => {
  dispatch({ type: TOGGLE_SIDEBAR });
};