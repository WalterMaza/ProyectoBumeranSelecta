import axios from "axios";

export const userRegisterService = async ({
  firstName,
  surname,
  age,
  country,
  email,
  password,
}) => {
  const register = await axios.post("http://localhost:3001/api/user/register", {
    firstName: firstName,
    surname: surname,
    age: age,
    country: country,
    email: email,
    password: password,
  });
  return register.data;
};

export const userLoginService = async ({ email, password }) => {
  const loginUser = await axios.post("http://localhost:3001/api/user/login", {
    email,
    password,
  });
  return loginUser.data;
};

export const userLogoutService = async () => {
  const logoutUser = await axios.post("http://localhost:3001/api/user/logout")
  return logoutUser.data
}

export const getUserService = async ({ email }) => {
  // console.log("MAIL", email)
  try {
    const getUser = await axios.get(`http://localhost:3001/api/user/find/${email.value}`)
    // console.log("GETUSER", getUser)
    return getUser.data
  }
  catch(error){
    console.log("ERROR", error)
    // alert("El usuario no existe", error)
  }
}

export const deleteUserService = async ({ id }) => {
  const deleteUser = await axios.delete(`http://localhost:3001/api/user/delete/${id}`)
  return deleteUser.data
}