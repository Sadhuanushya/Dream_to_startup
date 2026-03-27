import { useEffect, useReducer } from "react";
import UserContext from "../Context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_SERVER_ERRORS":
      return { ...state, serverError: action.payload };

    case "CLEAR_SERVER_ERRORS":
      return { ...state, serverError: "" };

    case "Account":
      return { ...state, user: action.payload };

    default:
      return state;
  }
};

export default function AuthProvider(props) {
  const navigate = useNavigate();

  const [userState, userDispatch] = useReducer(userReducer, {
    user: null,
    serverError: "",
   
  });
console.log("server error",userState.serverError)
  const clearServerError = () => {
    userDispatch({ type: "CLEAR_SERVER_ERRORS" });
  };
  const handleAccount = async () => {
    if (localStorage.getItem("token")) {
      try {
        const response = await axios.get(
          "http://localhost:3080/api/account",
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log("account",response.data)
        userDispatch({ type: "Account", payload: response.data });
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    handleAccount();
  }, []);

  const handleRegister = async (RegisterData) => {
    userDispatch({ type: "CLEAR_SERVER_ERRORS" });
    try {
      await axios.post(
        "http://localhost:3080/api/register",
        RegisterData
      );

      alert("Successfully Registered");
   
      navigate("/login");  
    } catch (err) {
        console.log(err.response.data.error)
      const errorMessage =err.response?.data?.error
      userDispatch({
        type: "SET_SERVER_ERRORS",
        payload: errorMessage,
      });
    }
  };


const handleLogin = async (loginData) => {
  userDispatch({ type: "CLEAR_SERVER_ERRORS" });
  try {
    

    const response = await axios.post(
      "http://localhost:3080/api/login",
      loginData
    );

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("userId", response.data.userId);
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("name", response.data.username);
  

    userDispatch({
      type: "Account",
      payload: {
        _id: response.data.userId,
        role: response.data.role,
        username: response.data.username,
        email:response.data.email
      },
    });

    if (response.data.role === "admin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard/account");
    }

  } catch (err) {
    const errorMessage =
      err?.response?.data?.error ||
      "Invalid email or password";

    userDispatch({
      type: "SET_SERVER_ERRORS",
      payload: errorMessage,
    });
  }
};



  return (
    <UserContext.Provider
      value={{
        ...userState,
        handleRegister,
        handleLogin,
        handleAccount,
        clearServerError
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}