function logout() {
    localStorage.removeItem('authToken');
    
    window.location.href = 'login.html';
  }
  
  document.getElementById('logoutButton').addEventListener('click', logout);
  