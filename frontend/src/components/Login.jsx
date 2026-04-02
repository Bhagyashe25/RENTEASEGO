import React, { useState } from "react"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useAppContext } from "./context/AppContext"

const Login = () => {

  const { setShowLogin, login, register, loginAdmin, loginType } = useAppContext()
  const navigate = useNavigate()

  const [state, setState] = useState("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmitHandler = async (e) => {

    e.preventDefault()

    try {
    if (state === "login") {
        console.log("🔐 Login attempt:", { email, loginType });
        const isAdminEmail = email === "admin@rental.com";
        
        if (isAdminEmail) {
          await loginAdmin(email, password);
        } else {
          await login(email, password);
        }
      } else {
        await register(name, email, password);
      }
      navigate("/");

    } catch (error) {

      toast.error(error.message)

    }

  }

  return (

    <div
      onClick={() => setShowLogin(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/50"
    >

      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 p-8 w-80 bg-white rounded-lg shadow-xl"
      >

        <p className="text-2xl font-semibold text-center">
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (

          <div>
            <p>Name</p>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

        )}

        <div>
          <p>Email</p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <p>Password</p>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        {state === "login" ? (

          <p>
            Create account?{" "}
            <span
              onClick={() => setState("register")}
              className="text-blue-500 cursor-pointer"
            >
              Sign Up
            </span>
          </p>

        ) : (

          <p>
            Already have account?{" "}
            <span
              onClick={() => setState("login")}
              className="text-blue-500 cursor-pointer"
            >
              Login
            </span>
          </p>

        )}

        <button className="bg-blue-600 text-white py-2 rounded">
          {state === "login" ? "Login" : "Create Account"}
        </button>

      </form>

    </div>

  )

}

export default Login