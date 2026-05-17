function Contact() {
  return (
    <section className="container section">
      <div className="checkout-box">
        <h2>Contact Us</h2>
        <p>If you have any questions, feel free to contact our team.</p>

        <div style={{ display: "grid", gap: "14px", marginTop: "20px" }}>
          <div>
            <strong>Email:</strong>
            <p style={{ margin: "6px 0", color: "#666" }}>support@smartfurniture.com</p>
          </div>

          <div>
            <strong>Phone:</strong>
            <p style={{ margin: "6px 0", color: "#666" }}>+20 1000427270</p>
          </div>

          <div>
            <strong>Address:</strong>
            <p style={{ margin: "6px 0", color: "#666" }}>Cairo, Egypt</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;