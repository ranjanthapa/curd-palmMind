const apiBaseUrl = "http://localhost:5000/api/auth/all"; 


async function fetchAndDisplayUsers() {
  const token = localStorage.getItem('authToken');
  try {
    const response = await axios.get(apiBaseUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
   

    const userTableBody = document.getElementById("userTableBody");

    response.data.data.forEach((user, index) => {
      const tableRow = `
        <tr data-bs-toggle="modal" data-bs-target="#userDetailsModal" onclick="showUserDetails('${user.fullName}', '${user.email}')">
          <td>${index + 1}</td>
          <td>${user.fullName}</td>
          <td>${user.email}</td>
        </tr>
      `;
      userTableBody.innerHTML += tableRow;
    });
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

function showUserDetails(name, email) {
  document.getElementById("modalUserName").textContent = name
  document.getElementById("modalUserEmail").textContent = email
}

document.addEventListener("DOMContentLoaded", fetchAndDisplayUsers);
