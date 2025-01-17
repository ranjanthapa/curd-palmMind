document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const responseMessage = document.getElementById("responseMessage");
  
    if (password !== confirmPassword) {
      responseMessage.innerHTML = `<div class="alert alert-danger">Passwords do not match.</div>`;
      return;
    }
  
    try {
      const apiBaseUrl = "http://localhost:5000/api/auth/register";
  
      const response = await axios.post(apiBaseUrl, {
        fullName,
        email,
        password,
      });
      console.log(response);
      responseMessage.innerHTML = `
        <div class="alert alert-success">${response.data.message || "Registration successful! Please log in."}</div>
      `;
  
      setTimeout(() => {
        window.location.href = "index.html"; 
      }, 2000);
    } catch (error) {
        console.log(error);
      responseMessage.innerHTML = `
        <div class="alert alert-danger">${error.response?.data?.message || "Registration failed!"}</div>
      `;
    }
  });
  