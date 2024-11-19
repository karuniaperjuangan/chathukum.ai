import { useState } from "react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (!username || !email || !password) {
      toast.error("Tolong isi semua kolom");
      return;
    }
    if (password.length < 8) {
      toast.error("Password minimal terdiri dari 8 huruf");
      return;
    }
    if (username.length < 8) {
      toast.error("Username minimal terdiri dari 8 huruf");
      return;
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) === false) {
      toast.error("Email tidak valid");
    }

    const response = await fetch(
      import.meta.env.VITE_BASE_API_URL + "/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      }
    );
    if (response.ok) {
      toast.success("Berhasil mendaftar!");
      setTimeout(() => {
        window.location.href = "/auth/login"; // Redirect to dashboard after login success
      }, 1000); // Delay for 1 second before redirecting
    } else {
      toast.error("Gagal mendaftar!"+response.statusText);
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
          <h1 className="text-2xl font-bold">Buat Akun Baru</h1>
          <input
            type="username"
            placeholder="Username"
            className="p-2 border rounded"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="email"
            placeholder="Email"
            className="p-2 border rounded"
            onChange={(e) => {
              setEmail(e.target.value);
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
            onClick={handleRegister}
            className=" w-full bg-ch-coral hover:bg-ch-brick-red text-white py-2 px-6 rounded"
          >
            Daftar
          </button>
          <footer className="flex items-center justify-center w-full h-16">
            <p>
              Sudah punya akun?{" "}
              <a
                href="/auth/login"
                className=" text-ch-sky-blue hover:text-ch-dark-blue-purple underline"
              >
                Login
              </a>
            </p>
          </footer>
        </div>
        {/* Footer with a link to thelogin page */}
      </div>
    </div>
  );
}
