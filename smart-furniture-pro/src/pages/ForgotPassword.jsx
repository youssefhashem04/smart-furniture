function ForgotPassword() {
  return (
    <section className="container section narrow-section">
      <div className="auth-card">
        <h2>Reset Password</h2>
        <form className="checkout-form">
          <input type="email" placeholder="Enter your email" />
          <button type="button" className="btn btn-dark">Send Reset Link</button>
        </form>
      </div>
    </section>
  );
}

export default ForgotPassword;