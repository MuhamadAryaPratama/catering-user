import React, { useState } from "react";
import axios from "axios";

const Payment = () => {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      // Kirim data ke backend
      const response = await axios.post(
        "http://localhost:8000/payment/create",
        {
          amount,
          method,
          email,
          phone,
          customer_name: customerName,
          product_details: "Produk Contoh",
        }
      );

      // Jika berhasil, redirect ke URL pembayaran
      if (response.data.status === "success") {
        window.location.href = response.data.paymentUrl;
      } else {
        alert("Gagal membuat pembayaran: " + response.data.message);
      }
    } catch (error) {
      console.error("Error saat memproses pembayaran:", error);
      alert("Terjadi kesalahan saat memproses pembayaran");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Pembayaran dengan Duitku</h1>
      <form onSubmit={handlePayment}>
        <div>
          <label>Jumlah Pembayaran (Rp):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Metode Pembayaran:</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            required
          >
            <option value="">Pilih Metode</option>
            <option value="VC">Virtual Account</option>
            <option value="CC">Kartu Kredit</option>
            <option value="M1">QRIS</option>
          </select>
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nomor Telepon:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nama Pelanggan:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Bayar Sekarang
        </button>
      </form>
    </div>
  );
};

export default Payment;
