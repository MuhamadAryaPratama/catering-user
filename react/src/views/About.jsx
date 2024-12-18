import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axiosClient from "../axiosClient";

function About() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await axiosClient.get("/cart");
        // Calculate the total count of items by summing the 'jumlah' property
        const totalCartCount = response.data.data.reduce(
          (total, item) => total + item.jumlah,
          0
        );
        setCartCount(totalCartCount);
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();
  }, []);

  return (
    <>
      <Navbar cartCount={cartCount} />
      <div className="container mx-auto px-4 py-8">
        <div className="header text-center mb-8">
          <h1 className="text-3xl font-bold">Warung Nasi Marsel</h1>
        </div>

        {/* Main Content Section */}
        <div className="main-content flex flex-col md:flex-row md:space-x-8 bg-orange-100 p-8 rounded-lg">
          {/* Map Section with Centered Title */}
          <div className="location md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-2xl font-semibold text-center mb-4">Lokasi</h2>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.44811654303!2d106.83169077453273!3d-6.335953161992128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69edaea5fe6f59%3A0x26f70cea80aa96b1!2sWarung%20Nasi%20Marsel!5e0!3m2!1sid!2sid!4v1721817577383!5m2!1sid!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          {/* About Us and Contact Section */}
          <div className="about-us md:w-1/2 flex flex-col justify-start pt-10">
            <h2 className="text-2xl font-semibold mb-4">Sejarah</h2>
            <p className="mb-6">
              Warung Nasi Marsel adalah tempat makan yang berasal dari Kuningan
              Jawa Barat, menawarkan berbagai macam hidangan khas Sunda. Kami
              menggunakan bahan-bahan segar dan berkualitas untuk menyajikan
              makanan yang lezat dan bergizi. Dengan suasana yang nyaman dan
              pelayanan yang ramah, kami berkomitmen untuk memberikan pengalaman
              makan yang menyenangkan bagi semua pelanggan kami.
            </p>
            <div className="contact mt-8">
              <h2 className="text-2xl font-semibold mb-4">Kontak Kami</h2>
              <div className="contact-details space-y-2">
                <p>
                  <strong>Alamat:</strong> Jl. Buku Dikrama RT.05 RW.04 NO.35
                </p>
                <p>
                  <strong>Telepon:</strong> +62 812-9591-7717
                </p>
                <p>
                  <strong>Email:</strong> warungnasimarsel@gmail.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
