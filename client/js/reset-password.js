document.getElementById("resetPasswordForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token"); 
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
  
    if (newPassword !== confirmPassword) {
      document.getElementById("responseMessage").innerHTML = `
        <div class="alert alert-danger">Passwords do not match!</div>
      `;
      return;
    }
  
    try {
      const response = await axios.patch(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password: newPassword,
      });


        document.getElementById("responseMessage").innerHTML = `
          <div class="alert alert-success">Password reset successful! You can now <a href="index.html">Login</a>.</div>
        `;
        setTimeout(() => {
            window.location.href = "index.html"; 
          }, 2000);
      
    } catch (error) {
      document.getElementById("responseMessage").innerHTML = `
        <div class="alert alert-danger">${error.response?.data?.message || "Failed to reset password!"}</div>
      `;
    }
  });
  