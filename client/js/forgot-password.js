document.getElementById("forgotPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
  
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      document.getElementById("responseMessage").innerHTML = `
        <div class="alert alert-success">Reset link sent to your email!</div>
      `;
    } catch (error) {
      document.getElementById("responseMessage").innerHTML = `
        <div class="alert alert-danger">${error.response?.data?.message || "Failed to send reset link!"}</div>
      `;
    }
  });
  