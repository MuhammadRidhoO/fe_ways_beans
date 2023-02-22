import { createContext, useReducer } from "react";

export const UserContext = createContext();

const initialState = {
  isLogin: false,
  user: {},
};

const reducer = (state, action) => {
  const { type, payload, cityPayload, thatTrue } = action;

  switch (type) {
    case "LOGIN_SUCCESS":
    case "USER_SUCCESS":
      localStorage.setItem("token", payload.token);
      // localStorage.setItem("token", payload.token)
      // localStorage.setItem("status", payload.status);
      // localStorage.setItem("users", JSON.stringify(payload));
      // console.log(payload);
      return {
        isLogin: true,
        user: payload,
      };
    case "LOGOUT":
    case "AUTH_ERROR":
      localStorage.removeItem("token");
      // localStorage.removeItem("status");
      // localStorage.removeItem("users", JSON.stringify(payload));
      return {
        isLogin: false,
        user: {},
      };
    // case "CITY":
    //   return {
    //     isLogin: thatTrue,
    //     user: payload,
    //     city: cityPayload
    //   };
    default:
      throw new Error();
  }
};


export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
};
