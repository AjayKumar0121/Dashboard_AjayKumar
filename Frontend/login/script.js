function showAlert(type, message) {
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('password').parentElement.querySelector('.eye-icon');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    eyeIcon.textContent = passwordInput.type === 'password' ? '👁️' : '🔓';
}

function validateForm() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!email) {
        errorMessage.textContent = 'Email is required';
        showAlert('error', 'Email is required');
        return false;
    }
    if (!emailRegex.test(email)) {
        errorMessage.textContent = 'Invalid email format';
        showAlert('error', 'Invalid email format');
        return false;
    }
    if (email.includes(' ')) {
        errorMessage.textContent = 'No spaces allowed in email';
        showAlert('error', 'No spaces allowed in email');
        return false;
    }
    if (!password) {
        errorMessage.textContent = 'Password is required';
        showAlert('error', 'Password is required');
        return false;
    }
    if (password.includes(' ')) {
        errorMessage.textContent = 'No spaces allowed in password';
        showAlert('error', 'No spaces allowed in password');
        return false;
    }
    errorMessage.textContent = '';
    return true;
}

document.getElementById('email').addEventListener('input', () => {
    document.getElementById('error-message').textContent = '';
});

document.getElementById('password').addEventListener('input', () => {
    document.getElementById('error-message').textContent = '';
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    if (!validateForm()) return;

    try {
        console.log('🔄 Sending login request:', { email });

        const response = await fetch('http://44.223.23.145:3400/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log('✅ Login response:', { status: response.status, data });

        if (response.ok && data.token) {
            try {
                localStorage.setItem('token', data.token);
                showAlert('success', '🔐 Token saved to localStorage');
                showAlert('success', '✅ Login successful');
                setTimeout(() => {
                    window.location.href = '/dashboard'; // adjust if needed
                }, 3000);
            } catch (err) {
                showAlert('error', '⚠️ Failed to save token to localStorage');
                console.error('localStorage error:', err);
            }
        } else {
            errorMessage.textContent = data.error || 'Login failed';
            showAlert('error', data.error || '❌ Login failed');
        }
    } catch (err) {
        console.error('🚨 Login error:', err);
        errorMessage.textContent = 'Error connecting to server';
        showAlert('error', '❌ Error connecting to server');
    }
});
