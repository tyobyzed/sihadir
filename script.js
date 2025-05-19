const SPREADSHEET_ID = '1rrt2ivDW8dIbC5Tf8UpJpzWtbUN_4uFSxVpWnOPyWgk';
const API_KEY = 'AIzaSyCXqe83I2RilHrPw4Wy8U4eA_hah7rnP7Q';
const RANGE = 'Akun!A2:E';

const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

async function fetchAkun() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mengambil data akun');
  const data = await res.json();
  return data.values; // Array of arrays
}

function saveSession(user) {
  sessionStorage.setItem('user', JSON.stringify(user));
}

function redirectDashboard(role) {
  if (role === 'admin') {
    window.location.href = 'dashboard-admin.html';
  } else if (role === 'guru') {
    window.location.href = 'dashboard-guru.html';
  } else if (role === 'siswa') {
    window.location.href = 'dashboard-siswa.html';
  } else {
    loginError.textContent = 'Role pengguna tidak dikenal.';
  }
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  
  const usernameInput = document.getElementById('username').value.trim();
  const passwordInput = document.getElementById('password').value.trim();
  
  try {
    const akunList = await fetchAkun();
    const user = akunList.find(row => row[2] === usernameInput && row[3] === passwordInput);
    
    if (user) {
      // user = [ID, Nama, Username, Password, Role]
      saveSession({
        id: user[0],
        nama: user[1],
        username: user[2],
        role: user[4]
      });
      redirectDashboard(user[4]);
    } else {
      loginError.textContent = 'Username atau password salah.';
    }
  } catch (error) {
    loginError.textContent = 'Error koneksi ke server. Coba lagi nanti.';
    console.error(error);
  }
});
