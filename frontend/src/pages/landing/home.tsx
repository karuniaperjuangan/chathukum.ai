import timbanganHukum from "../../assets/timbangan_hukum.png";
import books from "../../assets/books.png";
import robot from "../../assets/llm_robot.png";

export default function HomePage() {
  return (
    <>
      <section className=" md:grid md:grid-cols-2 gap-8 flex flex-col items-center justify-center  min-h-[60vh]">
        <div className=" max-w-2xl mx-auto w-fit flex flex-col items-center">
          <h2 className="text-4xl font-bold text-center mt-8">
            Selamat Datang di ChatHukum.ai
          </h2>
          <p className="text-xl text-center mt-4">
            Platform berbasis AI di mana anda dapat bertanya isi segala
            undang-undang dan peraturan yang ada di Indonesia.
          </p>
          <a
            href="/auth/login"
            className="mx-auto text-lg text-center mt-4 bg-ch-coral hover:bg-ch-brick-red py-2 px-4 text-white rounded-md"
          >
            Masuk untuk Mencoba
          </a>
        </div>
        <img
          src={timbanganHukum}
          alt="Timbangan Hukum"
          className="max-w-2xl mx-auto h-96 object-contain"
        />
      </section>
      <section className=" md:grid md:grid-cols-2 gap-8 flex flex-col items-center justify-center min-h-[60vh]">
        <img
          src={books}
          alt="buku"
          className="mx-auto h-96 object-contain order-2 md:order-1"
        />
        <div className=" max-w-2xl mx-auto w-fit flex flex-col items-center  order-1 md:order-2">
          <p className="text-xl text-center mt-4">
            Akses lebih dari 250.000 dokumen peraturan perundang-undangan yang
            ada di dalam <i>database</i> kami
          </p>
        </div>
      </section>
      <section className=" md:grid md:grid-cols-2 gap-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className=" max-w-2xl mx-auto w-fit flex flex-col items-center">
          <p className="text-xl text-center mt-4">
            Didukung oleh model GPT-4o-mini yang mampu menjawab pertanyaan
            mengenai hukum dengan cepat dan akurat melalui koneksi langsung
            dengan database kami.
          </p>
        </div>
        <img
          src={robot}
          alt="Robot"
          className="max-w-2xl mx-auto h-96 object-contain"
        />
      </section>
    </>
  );
}
