import timbanganHukum from "../assets/timbangan_hukum.png"


export default function LandingPage() {
    return (
        <>
        <nav className="fixed h-16 w-screen bg-white top-0 shadow-lg">
            <div className="flex h-full items-center mx-8">
                <h1 className=" text-xl font-bold text-ch-coral hover:text-ch-brick-red transition-colors">ChatHukum.ai</h1>
                <div className="flex-1"></div>
                <div className="flex gap-4">
                    <a href="/auth/login" className=" font-semibold">Login</a>
                    <a href="#" className=" font-semibold">Petunjuk</a>
                    <a href="#" className=" font-semibold">Tentang</a>
                </div>
            </div>
        </nav>
        <div className="h-20"></div>
        <section className=" md:grid md:grid-cols-2 gap-8 flex flex-col items-center justify-center h-[80vh]">
        <div className=" max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-center mt-8">Selamat Datang di ChatHukum.ai</h2>
            <p className="text-xl text-center mt-4">Platform berbasis AI di mana anda dapat bertanya isi segala undang-undang dan peraturan yang ada di Indonesia.</p>
        </div>
        <img src={timbanganHukum} alt="Timbangan Hukum" className="max-w-2xl mx-auto h-72 object-contain"/>
        </section>
        <div>
            {Array.from({ length: 10 }, (_, i) => (
                <div key={i}>
                    <p>{`Item ${i + 1}`}</p>
        </div>))}
        </div>
        <div>
        </div>
        </>
    );
}