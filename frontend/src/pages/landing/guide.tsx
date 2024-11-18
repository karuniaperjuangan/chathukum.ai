import loginGuide from "../../assets/guides/1.login.png";
import selectDocumentGuide from "../../assets/guides/2.add_document.png";
import chatGuide from "../../assets/guides/3.chat.png";
import historyGuide from "../../assets/guides/4.history.png";

export default function GuidePage() {
  return (
    <>
      <h2 className="mx-auto text-center text-4xl">Petunjuk</h2>
      <section className=" md:grid md:grid-cols-2 gap-8 flex flex-col items-center justify-center  min-h-[60vh]">
        <div className=" max-w-2xl mx-auto w-fit flex flex-col items-center">
          <h2 className="text-4xl font-bold text-center mt-8">
            1. Lakukan Login
          </h2>
          <p className="text-xl text-center mt-4">
            Anda harus masuk menggunakan akun yang telah didaftarkan sebelumnya.
            Jika belum memiliki akun, silakan daftar terlebih dahulu.
          </p>
        </div>
        <img
          src={loginGuide}
          alt="Timbangan Hukum"
          className="max-w-2xl mx-auto h-full object-contain"
        />
      </section>
      <section className=" md:grid md:grid-cols-2 gap-8 flex flex-col items-center justify-center  min-h-[60vh]">
        <div className=" max-w-2xl mx-auto w-fit flex flex-col items-center">
          <h2 className="text-4xl font-bold text-center mt-8">
            2. Pilih Dokumen
          </h2>
          <p className="text-xl text-center mt-4">
            Sebelum memulai chat, pilihlah daftar dokumen yang ingin ditanyakan.
            Anda dapat memilih hingga maksimal 10 dokumen.
          </p>
        </div>
        <img
          src={selectDocumentGuide}
          alt="Add document guide"
          className="max-w-2xl mx-auto h-full object-contain"
        />
      </section>
      <section className=" md:grid md:grid-cols-2 gap-8 flex flex-col items-center justify-center  min-h-[60vh]">
        <div className=" max-w-2xl mx-auto w-fit flex flex-col items-center">
          <h2 className="text-4xl font-bold text-center mt-8">
            3. Mulai Obrolan
          </h2>
          <p className="text-xl text-center mt-4">
            Tuliskan pertanyaan Anda dan klik tombol "Kirim". AI akan merespons
            pertanyaan Anda berdasarkan informasi dalam dokumen yang telah
            dipilih.
          </p>
        </div>
        <img
          src={chatGuide}
          alt="Add document guide"
          className="max-w-2xl mx-auto h-full object-contain"
        />
      </section>
      <section className=" md:grid md:grid-cols-2 gap-8 flex flex-col items-center justify-center  min-h-[60vh]">
        <div className=" max-w-2xl mx-auto w-fit flex flex-col items-center">
          <h2 className="text-4xl font-bold text-center mt-8">
            4. Membuka Riwayat Obrolan
          </h2>
          <p className="text-xl text-center mt-4">
            Anda dapat mengakses riwayat obrolan dengan memilih riwayat obrolan
            di sebelah kiri halaman. Anda juga dapat menghapus riwayat obrolan
            jika diperlukan.
          </p>
        </div>
        <img
          src={historyGuide}
          alt="Add document guide"
          className="max-w-2xl mx-auto h-full object-contain"
        />
      </section>
    </>
  );
}
