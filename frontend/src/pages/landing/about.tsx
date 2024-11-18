export default function AboutPage() {
  return (
    <section className="gap-8 flex flex-col items-center justify-center  min-h-[80vh]">
      <div className=" max-w-4xl mx-auto w-fit flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center mt-8">Tentang</h2>
        <p className="text-xl text-center mt-4">
          ChatHukum.ai merupakan sebuah situs berbasis AI yang dikembangkan oleh{" "}
          <a
            className="text-ch-coral hover:text-ch-brick-red"
            href="https://www.linkedin.com/in/karunia-perjuangan-mustadl-afin-620420175/"
          >
            Karunia Perjuangan M
          </a>{" "}
          sebagai satu proyek personal. Fungsionalitas website ini terinspirasi
          dari{" "}
          <a
            className="text-ch-coral hover:text-ch-brick-red"
            href="https://ask.hukumonline.com/"
          >
            Ask Hukum Online
          </a>{" "}
          dan proyek tim penulis di Pijar Foundation, sementara palet desain
          yang digunakan bersumber dari{" "}
          <a
            className="text-ch-coral hover:text-ch-brick-red"
            href="https://bijakmemilih.framer.website/"
          >
            Bijak Memilih
          </a>
        </p>
        <h2 className="text-4xl font-bold text-center mt-8">
          Teknologi yang digunakan
        </h2>
        <div className="flex items-center justify-center space-x-4 mt-4 w-full flex-wrap">
          <img
            src="https://images.credly.com/images/1c2c86e1-16ce-4e4d-a425-d1ac96bb026d/express.png"
            className="h-24"
          />
          <img
            src="https://avatars.githubusercontent.com/u/108468352?v=4"
            className="h-24"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/993px-Postgresql_elephant.svg.png"
            className="h-24"
          />
          <img
            src="https://miro.medium.com/v2/resize:fit:622/1*MVJZLfszGGNiJ-UFK4U31A.png"
            className="h-24"
          />
          <img
            src="https://logos-world.net/wp-content/uploads/2024/08/OpenAI-Logo.png"
            className="h-24"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/862px-React-icon.svg.png"
            className="h-24"
          />
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Tailwind_CSS_Logo.svg/1280px-Tailwind_CSS_Logo.svg.png"
            className="h-24"
          />
        </div>
      </div>
    </section>
  );
}
