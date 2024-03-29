import React, { useEffect, useState } from "react";
import google from "../../assets/icons/google.png";
import { AiFillGoogleCircle } from "react-icons/ai";
import {
  useSignInWithGoogle,
  useSignInWithEmailAndPassword,
  useSendPasswordResetEmail,
} from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Loading from "../../Shared/Loading";
import useToken from "../../Hooks/useToken";
import { toast } from "react-toastify";
import { Button, TextField } from "@mui/material";
import { HashLoader } from "react-spinners";

const Login = () => {
  const [email, setEmail] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [sendPasswordResetEmail] = useSendPasswordResetEmail(auth);
  const [token] = useToken(user || gUser);
  let signInErrorMessage;
  const navigate = useNavigate();
  const location = useLocation();
  let from = location.state?.from?.pathname || "/";
  useEffect(() => {
    if (token) {
      navigate(from, { replace: true });
    }
  }, [token, from, navigate]);
  if (loading || gLoading) {
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <HashLoader size={70} color="#FF7400" />
      </div>
    );
  }
  if (error || gError) {
    signInErrorMessage = (
      <p>
        <small className="text-red-500">
          {error?.message || gError?.message}
        </small>
      </p>
    );
  }
  const resetPassword = async () => {
    if (email) {
      await sendPasswordResetEmail(email);
      toast("Sent email");
    } else {
      toast.error("Please enter your email");
    }
  };
  const onSubmit = async (data) => {
    await signInWithEmailAndPassword(data.email, data.password);
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="lg:w-2/6 bg-[#FDBE06] rounded-md mt-20 mx-5">
        <div className="card-body">
          <h2 className="text-center text-4xl text-[#000] font-bold">Login</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              {/* <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                    message: "Please provide a valid email",
                  },
                })}
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="input input-bordered w-full max-w-xs"
              /> */}
              <TextField
                {...register("email", {
                  required: {
                    value: true,
                    message: "Email is required",
                  },
                  pattern: {
                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                    message: "Please provide a valid email",
                  },
                })}
                sx={{
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                id="outlined-basic"
                label="Email"
                variant="filled"
              />
              <label className="label">
                {errors.email?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                )}
                {errors.email?.type === "pattern" && (
                  <span className="label-text-alt text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </label>
            </div>
            <div className="form-control w-full">
              {/* <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Must be 6 character or lognger",
                  },
                })}
                type="password"
                placeholder="Your Email"
                className="input input-bordered w-full max-w-xs"
              /> */}
              <TextField
                {...register("password", {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                  minLength: {
                    value: 6,
                    message: "Must be 6 character or lognger",
                  },
                })}
                type="password"
                sx={{
                  marginTop: "10px",
                  marginLeft: "10px",
                }}
                name="password"
                onChange={(e) => setEmail(e.target.value)}
                id="outlined-basic"
                label="Password"
                variant="filled"
              />
              <label className="label">
                {errors.password?.type === "required" && (
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                )}
                {errors.password?.type === "minLength" && (
                  <span className="label-text-alt text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </label>
            </div>
            <p className="mb-2">{signInErrorMessage}</p>
            <button
              className="bg-[#000] p-3 rounded-md text-[#fff] w-full"
              type="submit"
              value="Login"
            >
              LOGIN
            </button>
          </form>
          <p className="text-center">
            <small>
              Forget your password?{" "}
              <span
                onClick={resetPassword}
                className="text-[#FF0000] cursor-pointer"
              >
                Reset Password
              </span>
            </small>
          </p>
          <p className="text-center">
            <small>
              New to Fix-Manufacturer?{" "}
              <Link to="/signup" className="text-[#FF0000]">
                Create new account
              </Link>
            </small>
          </p>
          <div className="divider">OR</div>
          <button
            onClick={() => signInWithGoogle()}
            className="bg-transparent border border-[#000] p-3 rounded-md text-[#000] w-full flex justify-center items-center lg:px-14 hover:bg-[#000] hover:text-[#fff]"
          >
            Continue with GOOGLE
            <AiFillGoogleCircle className="text-2xl ml-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
