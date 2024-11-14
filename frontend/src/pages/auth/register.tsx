
export default function RegisterPage() {
    return (
        <div className=" w-screen h-screen flex flex-col bg-ch-almost-white">
            {/* Login Form in the middle of the page */}
            <div className="flex flex-col items-center justify-center w-fit h-fit my-auto mx-auto ">
            <a className=" text-ch-coral font-bold text-2xl py-4 hover:text-ch-brick-red transition-all" href="/">ChatHukum.ai</a>
            <form className="flex flex-col items-center justify-center w-fit h-fit space-y-4 shadow-lg shadow-gray-300 py-8 px-8 rounded-lg bg-white">
                <h1 className="text-2xl font-bold">Buat Akun Baru</h1>
                <input type="username" placeholder="Username" className="p-2 border rounded" />
                <input type="email" placeholder="Email" className="p-2 border rounded" />
                <input type="password" placeholder="Password" className="p-2 border rounded" />
                <button type="submit" className=" w-full bg-ch-coral hover:bg-ch-brick-red text-white py-2 px-6 rounded">Daftar</button>
            <footer className="flex items-center justify-center w-full h-16">
                <p>Sudah punya akun? <a href="/auth/login" className=" text-ch-sky-blue hover:text-ch-dark-blue-purple underline">Login</a></p>
            </footer>           
            </form>
            {/* Footer with a link to thelogin page */}
        </div>
        </div>
    );
}