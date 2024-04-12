import { useState, useEffect } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div
      className={" w-full h-screen flex flex-col justify-center items-center"}
    >
      {profile ? (
        <div
          className={
            "flex sm:flex-row border border-transparent rounded-[10px] p-6 gap-4 shadow-hoverProfileCard hover:shadow-profileCard flex-col"
          }
        >
          <img
            src={profile.picture}
            alt="user image"
            className={"w-full sm:w-[200px] max-h-[300px]"}
          />
          <div className={"flex flex-col gap-4 justify-between"}>
            <div>
              <div className={"text-xl font-bold"}>User Logged in</div>
              <div>
                <span className={"font-bold"}>Name:-</span> {profile.name}
              </div>
              <div>
                <span className={"font-bold"}>Email Address:-</span>{" "}
                {profile?.email}
              </div>
            </div>
            <button
              onClick={logOut}
              className={
                "bg-[#f9f9f9] text-base font-medium cursor-pointer py-2.5 px-5 rounded-lg border border-transparent hover:border-[#646cff]"
              }
            >
              Log out
            </button>
          </div>
        </div>
      ) : (
        <div className={"flex flex-col gap-4"}>
          <h2 className={"font-bold text-xl"}>
            Please Sign In using Google Account
          </h2>
          <button
            onClick={login}
            className={
              "bg-[#f9f9f9] text-base font-medium cursor-pointer py-2.5 px-5 rounded-lg border border-transparent hover:border-[#646cff]"
            }
          >
            Sign in with Google 🚀{" "}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
