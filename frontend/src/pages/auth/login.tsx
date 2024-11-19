import { useState } from "react";
import { toast } from "react-toastify";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function Login() {
    const response = await fetch(
      import.meta.env.VITE_BASE_API_URL + "/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );
    if (response.ok) {
      toast.success("Berhasil Login!");
      const data = await response.json();
      localStorage.setItem("token", data.token); // Store token in local storage
      window.location.href = "/chat"; // Redirect to dashboard after login success
    } else {
      toast.error("Gagal login! "+response.statusText);
    }
  }
  return (
    <div className=" w-screen h-screen flex flex-col bg-ch-almost-white">
      {/* Login Form in the middle of the page */}
      <div className="flex flex-col items-center justify-center w-fit h-fit my-auto mx-auto ">
        <a
          className=" text-ch-coral font-bold text-2xl py-4 hover:text-ch-brick-red transition-all"
          href="/"
        >
          ChatHukum.ai
        </a>
        <div className="flex flex-col items-center justify-center w-fit h-fit space-y-4 shadow-lg shadow-gray-300 py-8 px-8 rounded-lg bg-white">
          <h1 className="text-2xl font-bold">Login</h1>
          <input
            type="username"
            placeholder="Username"
            className="p-2 border rounded"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button
            className=" w-full bg-ch-coral hover:bg-ch-brick-red text-white py-2 px-6 rounded"
            onClick={Login}
          >
            Login
          </button>
          <footer className="flex items-center justify-center w-full h-16">
            <p>
              Belum punya akun?{" "}
              <a
                href="/auth/register"
                className=" text-ch-sky-blue hover:text-ch-dark-blue-purple underline"
              >
                Daftar
              </a>
            </p>
          </footer>
        </div>
        {/* Footer with a link to the sign up page */}
      </div>
    </div>
  );
}
