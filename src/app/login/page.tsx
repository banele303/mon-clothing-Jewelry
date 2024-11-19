"use client";

import { useWixClient } from "@/hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

enum MODE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET_PASSWORD = "RESET_PASSWORD",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

export default function LoginPage() {
  const wixClient = useWixClient();
  const router = useRouter();

  const [mode, setMode] = useState<MODE>(MODE.LOGIN);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const isLoggedIn = await wixClient.auth.loggedIn();
        if (isLoggedIn) {
          router.push("/"); // Ensure this route exists
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setError("Failed to verify login status. Please refresh the page.");
      }
    };

    if (wixClient) {
      checkLoginStatus();
    }
  }, [wixClient, router]);

  const formTitle = {
    [MODE.LOGIN]: "Log in",
    [MODE.REGISTER]: "Register",
    [MODE.RESET_PASSWORD]: "Reset Your Password",
    [MODE.EMAIL_VERIFICATION]: "Verify Your Email",
  }[mode];

  const buttonTitle = {
    [MODE.LOGIN]: "Login",
    [MODE.REGISTER]: "Register",
    [MODE.RESET_PASSWORD]: "Reset",
    [MODE.EMAIL_VERIFICATION]: "Verify",
  }[mode];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      let response;

      switch (mode) {
        case MODE.LOGIN:
          response = await wixClient.auth.login({ email, password });
          break;
        case MODE.REGISTER:
          response = await wixClient.auth.register({
            email,
            password,
            profile: { nickname: username },
          });
          break;
        case MODE.RESET_PASSWORD:
          await wixClient.auth.sendPasswordResetEmail(email, window.location.href);
          setMessage("Password reset email sent. Please check your e-mail.");
          setIsLoading(false);
          return;
        case MODE.EMAIL_VERIFICATION:
          response = await wixClient.auth.processVerification({
            verificationCode: emailCode,
          });
          break;
        default:
          throw new Error("Invalid mode");
      }

      console.log("Login Response:", response);

      if (response?.loginState === LoginState.SUCCESS) {
        setMessage("Successful! Redirecting...");
        const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
          response.data.sessionToken!
        );

        console.log("Tokens:", tokens);

        if (tokens && tokens.refreshToken) {
          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            expires: 2,
            sameSite: "Lax",
            secure: window.location.protocol === "https:",
          });
          wixClient.auth.setTokens(tokens);
          setTimeout(() => router.push("/"), 2000);
        } else {
          throw new Error("Token retrieval failed");
        }
      } else if (response?.loginState === LoginState.FAILURE) {
        handleError(response.errorCode);
      } else if (response?.loginState === LoginState.EMAIL_VERIFICATION_REQUIRED) {
        setMode(MODE.EMAIL_VERIFICATION);
        setMessage("Email verification required. Check your email for the code.");
      } else if (response?.loginState === LoginState.OWNER_APPROVAL_REQUIRED) {
        setMessage("Your account is pending approval.");
      }
    } catch (err) {
      console.error("Error during login process:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errorCode: string) => {
    switch (errorCode) {
      case "invalidEmail":
      case "invalidPassword":
        setError("Invalid email or password!");
        break;
      case "emailAlreadyExists":
        setError("Email already exists!");
        break;
      case "resetPassword":
        setError("You need to reset your password!");
        break;
      default:
        setError("An unexpected error occurred!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {formTitle}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {mode === MODE.REGISTER && (
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Username"
                className="input"
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            {mode !== MODE.EMAIL_VERIFICATION && (
              <input
                id="email-address"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email address"
                className="input"
                onChange={(e) => setEmail(e.target.value)}
              />
            )}
            {mode === MODE.EMAIL_VERIFICATION ? (
              <input
                id="verification-code"
                name="verification-code"
                type="text"
                required
                autoComplete="one-time-code"
                placeholder="Verification Code"
                className="input"
                onChange={(e) => setEmailCode(e.target.value)}
              />
            ) : (
              (mode === MODE.LOGIN || mode === MODE.REGISTER) && (
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Password"
                  className="input"
                  onChange={(e) => setPassword(e.target.value)}
                />
              )
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="button"
          >
            {isLoading ? "Loading..." : buttonTitle}
          </button>
        </form>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
}


// "use client";

// import { useWixClient } from "@/hooks/useWixClient";
// import { LoginState } from "@wix/sdk";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { useState } from "react";

// enum MODE {
//   LOGIN = "LOGIN",
//   REGISTER = "REGISTER",
//   RESET_PASSWORD = "RESET_PASSWORD",
//   EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
// }

// const LoginPage = () => {
//   const wixClient = useWixClient();
//   const router = useRouter();

//   const isLoggedIn = wixClient.auth.loggedIn();

//   if (isLoggedIn) {
//     router.push("/");
//   }

//   const [mode, setMode] = useState(MODE.LOGIN);

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [emailCode, setEmailCode] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [message, setMessage] = useState("");

//   const formTitle =
//     mode === MODE.LOGIN
//       ? "Log in"
//       : mode === MODE.REGISTER
//       ? "Register"
//       : mode === MODE.RESET_PASSWORD
//       ? "Reset Your Password"
//       : "Verify Your Email";

//   const buttonTitle =
//     mode === MODE.LOGIN
//       ? "Login"
//       : mode === MODE.REGISTER
//       ? "Register"
//       : mode === MODE.RESET_PASSWORD
//       ? "Reset"
//       : "Verify";

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       let response;

//       switch (mode) {
//         case MODE.LOGIN:
//           response = await wixClient.auth.login({
//             email,
//             password,
//           });
//           break;
//         case MODE.REGISTER:
//           response = await wixClient.auth.register({
//             email,
//             password,
//             profile: { nickname: username },
//           });
//           break;
//         case MODE.RESET_PASSWORD:
//           response = await wixClient.auth.sendPasswordResetEmail(
//             email,
//             window.location.href
//           );
//           setMessage("Password reset email sent. Please check your e-mail.");
//           break;
//         case MODE.EMAIL_VERIFICATION:
//           response = await wixClient.auth.processVerification({
//             verificationCode: emailCode,
//           });
//           break;
//         default:
//           break;
//       }

//       switch (response?.loginState) {
//         case LoginState.SUCCESS:
//           setMessage("Successful! You are being redirected.");
//           const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
//             response.data.sessionToken!
//           );

//           Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
//             expires: 2,
//           });
//           wixClient.auth.setTokens(tokens);
//           router.push("/");
//           break;
//         case LoginState.FAILURE:
//           if (
//             response.errorCode === "invalidEmail" ||
//             response.errorCode === "invalidPassword"
//           ) {
//             setError("Invalid email or password!");
//           } else if (response.errorCode === "emailAlreadyExists") {
//             setError("Email already exists!");
//           } else if (response.errorCode === "resetPassword") {
//             setError("You need to reset your password!");
//           } else {
//             setError("Something went wrong!");
//           }
//         case LoginState.EMAIL_VERIFICATION_REQUIRED:
//           setMode(MODE.EMAIL_VERIFICATION);
//         case LoginState.OWNER_APPROVAL_REQUIRED:
//           setMessage("Your account is pending approval");
//         default:
//           break;
//       }
//     } catch (err) {
//       console.log(err);
//       setError("Something went wrong!");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center">
//       <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
//         <h1 className="text-2xl font-semibold">{formTitle}</h1>
//         {mode === MODE.REGISTER ? (
//           <div className="flex flex-col gap-2">
//             <label className="text-sm text-gray-700">Username</label>
//             <input
//               type="text"
//               name="username"
//               placeholder="john"
//               className="ring-2 ring-gray-300 rounded-md p-4"
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>
//         ) : null}
//         {mode !== MODE.EMAIL_VERIFICATION ? (
//           <div className="flex flex-col gap-2">
//             <label className="text-sm text-gray-700">E-mail</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="john@gmail.com"
//               className="ring-2 ring-gray-300 rounded-md p-4"
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//         ) : (
//           <div className="flex flex-col gap-2">
//             <label className="text-sm text-gray-700">Verification Code</label>
//             <input
//               type="text"
//               name="emailCode"
//               placeholder="Code"
//               className="ring-2 ring-gray-300 rounded-md p-4"
//               onChange={(e) => setEmailCode(e.target.value)}
//             />
//           </div>
//         )}
//         {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
//           <div className="flex flex-col gap-2">
//             <label className="text-sm text-gray-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               className="ring-2 ring-gray-300 rounded-md p-4"
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//         ) : null}
//         {mode === MODE.LOGIN && (
//           <div
//             className="text-sm underline cursor-pointer"
//             onClick={() => setMode(MODE.RESET_PASSWORD)}
//           >
//             Forgot Password?
//           </div>
//         )}
//         <button
//           className="bg-lama text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed"
//           disabled={isLoading}
//         >
//           {isLoading ? "Loading..." : buttonTitle}
//         </button>
//         {error && <div className="text-red-600">{error}</div>}
//         {mode === MODE.LOGIN && (
//           <div
//             className="text-sm underline cursor-pointer"
//             onClick={() => setMode(MODE.REGISTER)}
//           >
//             {"Don't"} have an account?
//           </div>
//         )}
//         {mode === MODE.REGISTER && (
//           <div
//             className="text-sm underline cursor-pointer"
//             onClick={() => setMode(MODE.LOGIN)}
//           >
//             Have and account?
//           </div>
//         )}
//         {mode === MODE.RESET_PASSWORD && (
//           <div
//             className="text-sm underline cursor-pointer"
//             onClick={() => setMode(MODE.LOGIN)}
//           >
//             Go back to Login
//           </div>
//         )}
//         {message && <div className="text-green-600 text-sm">{message}</div>}
//       </form>
//     </div>
//   );
// };

// export default LoginPage;
