/* ============================================
   SegmentIQ — Auth Logic (Login / Register)
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'segmentiq_auth';
  const DEMO_EMAIL = 'demo@segmentiq.io';
  const DEMO_PASSWORD = 'demo1234';

  /* ---------- Helpers ---------- */
  const showAlert = (el, message, type) => {
    if (!el) return;
    el.textContent = message;
    el.className = 'auth-alert show ' + (type || 'error');
  };

  const clearAlert = (el) => {
    if (!el) return;
    el.className = 'auth-alert';
    el.textContent = '';
  };

  const setFieldError = (inputId, message) => {
    const input = document.getElementById(inputId);
    const errorEl = document.querySelector(`.field-error[data-for="${inputId}"]`);
    if (input) input.classList.toggle('invalid', Boolean(message));
    if (errorEl) {
      errorEl.textContent = message || '';
      errorEl.classList.toggle('show', Boolean(message));
    }
  };

  const clearAllErrors = (form) => {
    if (!form) return;
    form.querySelectorAll('.field-error').forEach((el) => {
      el.textContent = '';
      el.classList.remove('show');
    });
    form.querySelectorAll('input, select').forEach((el) => el.classList.remove('invalid'));
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const saveSession = (user) => {
    try {
      const session = { user, loggedInAt: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn('Could not persist session', e);
    }
  };

  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem('segmentiq_user');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  };

  const storeUser = (user) => {
    try {
      localStorage.setItem('segmentiq_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Could not persist user', e);
    }
  };

  const goToDashboard = () => {
    window.location.href = 'dashboard.html';
  };

  /* ---------- Password visibility toggles ---------- */
  document.querySelectorAll('.toggle-pw').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btn.style.color = isPassword ? 'var(--accent)' : '';
    });
  });

  /* ============================================
     LOGIN PAGE
     ============================================ */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    const alertEl = document.getElementById('authAlert');

    // Demo button — instant access
    const demoBtn = document.getElementById('demoBtn');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        saveSession({ name: 'Alex Demo', email: DEMO_EMAIL, plan: 'Growth', demo: true });
        showAlert(alertEl, 'Signing you into the demo workspace…', 'success');
        setTimeout(goToDashboard, 700);
      });
    }

    // Pre-fill email input with demo credentials on load for convenience
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlert(alertEl);
      clearAllErrors(loginForm);

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      let valid = true;

      if (!email) {
        setFieldError('loginEmail', 'Email is required');
        valid = false;
      } else if (!isValidEmail(email)) {
        setFieldError('loginEmail', 'Please enter a valid email address');
        valid = false;
      }

      if (!password) {
        setFieldError('loginPassword', 'Password is required');
        valid = false;
      } else if (password.length < 6) {
        setFieldError('loginPassword', 'Password must be at least 6 characters');
        valid = false;
      }

      if (!valid) return;

      // Check against demo credentials or a stored registered user
      const storedUser = getStoredUser();
      const isDemo = email.toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
      const matchesStored =
        storedUser &&
        storedUser.email.toLowerCase() === email.toLowerCase() &&
        storedUser.password === password;

      if (isDemo) {
        saveSession({ name: 'Alex Demo', email: DEMO_EMAIL, plan: 'Growth', demo: true });
        showAlert(alertEl, 'Welcome back! Redirecting to your dashboard…', 'success');
        setTimeout(goToDashboard, 700);
      } else if (matchesStored) {
        saveSession({
          name: storedUser.name || 'User',
          email: storedUser.email,
          plan: storedUser.plan || 'Growth',
          demo: false,
        });
        showAlert(alertEl, `Welcome back, ${storedUser.name || 'there'}! Redirecting…`, 'success');
        setTimeout(goToDashboard, 700);
      } else {
        showAlert(
          alertEl,
          'Invalid credentials. Try the demo account: demo@segmentiq.io / demo1234',
          'error'
        );
        if (passwordInput) passwordInput.classList.add('invalid');
      }
    });

    // Live-clear errors while typing
    [emailInput, passwordInput].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        setFieldError(input.id, '');
        clearAlert(alertEl);
      });
    });
  }

  /* ============================================
     REGISTER PAGE
     ============================================ */
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    const alertEl = document.getElementById('authAlert');
    const stepperFill = document.getElementById('stepperFill');
    const steps = Array.from(registerForm.querySelectorAll('.form-step'));
    const dots = Array.from(document.querySelectorAll('.stepper-dot'));
    let currentStep = 1;

    const updateStepper = () => {
      if (stepperFill) {
        stepperFill.style.width = ((currentStep / 3) * 100) + '%';
      }
      dots.forEach((dot) => {
        const step = Number(dot.getAttribute('data-step'));
        dot.classList.toggle('active', step === currentStep);
        dot.classList.toggle('done', step < currentStep);
      });
    };

    const goToStep = (step) => {
      currentStep = Math.min(Math.max(step, 1), 3);
      steps.forEach((el) => {
        el.classList.toggle('active', Number(el.getAttribute('data-step')) === currentStep);
      });
      updateStepper();
      clearAlert(alertEl);
      // Scroll the card into view on mobile
      const card = registerForm.closest('.auth-card');
      if (card && window.innerWidth < 700) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    /* --- Password strength meter --- */
    const pwInput = document.getElementById('regPassword');
    const pwStrength = document.getElementById('pwStrength');
    const pwLabel = pwStrength ? pwStrength.querySelector('.pw-label') : null;

    const scorePassword = (value) => {
      let score = 0;
      if (value.length >= 8) score++;
      if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
      if (/\d/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      return score;
    };

    if (pwInput && pwStrength) {
      pwInput.addEventListener('input', () => {
        const value = pwInput.value;
        if (!value) {
          pwStrength.classList.remove('show');
          pwStrength.removeAttribute('data-level');
          if (pwLabel) pwLabel.textContent = 'Password strength';
          return;
        }
        pwStrength.classList.add('show');
        const score = scorePassword(value);
        pwStrength.setAttribute('data-level', String(score));
        const labels = { 0: 'Too weak', 1: 'Weak', 2: 'Fair', 3: 'Good', 4: 'Strong' };
        if (pwLabel) pwLabel.textContent = labels[score] || 'Password strength';
      });
    }

    /* --- Chip multi-select --- */
    const selectedSources = new Set();
    document.querySelectorAll('#sourceChips .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        const value = chip.getAttribute('data-value');
        if (selectedSources.has(value)) {
          selectedSources.delete(value);
          chip.classList.remove('selected');
        } else {
          selectedSources.add(value);
          chip.classList.add('selected');
        }
      });
    });

    /* --- Step validation --- */
    const validateStep1 = () => {
      let valid = true;
      const name = document.getElementById('regName');
      const email = document.getElementById('regEmail');
      const password = document.getElementById('regPassword');
      const confirm = document.getElementById('regConfirm');

      if (!name.value.trim()) {
        setFieldError('regName', 'Full name is required');
        valid = false;
      }
      if (!email.value.trim()) {
        setFieldError('regEmail', 'Email is required');
        valid = false;
      } else if (!isValidEmail(email.value.trim())) {
        setFieldError('regEmail', 'Please enter a valid email address');
        valid = false;
      }
      if (!password.value) {
        setFieldError('regPassword', 'Password is required');
        valid = false;
      } else if (password.value.length < 8) {
        setFieldError('regPassword', 'Password must be at least 8 characters');
        valid = false;
      }
      if (!confirm.value) {
        setFieldError('regConfirm', 'Please confirm your password');
        valid = false;
      } else if (confirm.value !== password.value) {
        setFieldError('regConfirm', 'Passwords do not match');
        valid = false;
      }
      return valid;
    };

    const validateStep2 = () => {
      let valid = true;
      const company = document.getElementById('regCompany');
      const role = document.getElementById('regRole');
      const size = document.getElementById('regSize');

      if (!company.value.trim()) {
        setFieldError('regCompany', 'Company name is required');
        valid = false;
      }
      if (!role.value) {
        setFieldError('regRole', 'Please select your role');
        valid = false;
      }
      if (!size.value) {
        setFieldError('regSize', 'Please select company size');
        valid = false;
      }
      return valid;
    };

    /* --- Navigation buttons --- */
    registerForm.querySelectorAll('[data-next]').forEach((btn) => {
      btn.addEventListener('click', () => {
        clearAlert(alertEl);
        const target = Number(btn.getAttribute('data-next'));
        if (currentStep === 1 && !validateStep1()) return;
        if (currentStep === 2 && !validateStep2()) return;
        goToStep(target);
      });
    });

    registerForm.querySelectorAll('[data-prev]').forEach((btn) => {
      btn.addEventListener('click', () => {
        goToStep(Number(btn.getAttribute('data-prev')));
      });
    });

    /* --- Live-clear errors on input --- */
    registerForm.querySelectorAll('input, select').forEach((input) => {
      input.addEventListener('input', () => {
        if (input.id) setFieldError(input.id, '');
        clearAlert(alertEl);
      });
      input.addEventListener('change', () => {
        if (input.id) setFieldError(input.id, '');
      });
    });

    /* --- Final submit --- */
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAlert(alertEl);

      if (!validateStep1()) {
        goToStep(1);
        return;
      }
      if (!validateStep2()) {
        goToStep(2);
        return;
      }

      const terms = document.getElementById('agreeTerms');
      if (!terms.checked) {
        setFieldError('agreeTerms', 'You must accept the terms to continue');
        return;
      }
      setFieldError('agreeTerms', '');

      const planInput = registerForm.querySelector('input[name="plan"]:checked');
      const user = {
        name: document.getElementById('regName').value.trim(),
        email: document.getElementById('regEmail').value.trim(),
        password: document.getElementById('regPassword').value,
        company: document.getElementById('regCompany').value.trim(),
        role: document.getElementById('regRole').value,
        size: document.getElementById('regSize').value,
        sources: Array.from(selectedSources),
        plan: planInput ? planInput.value : 'Growth',
        createdAt: new Date().toISOString(),
      };

      storeUser(user);
      saveSession({ name: user.name, email: user.email, plan: user.plan, demo: false });

      const submitBtn = registerForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating your workspace…';
      }

      showAlert(alertEl, 'Account created! Setting up your dashboard…', 'success');
      setTimeout(goToDashboard, 1100);
    });

    updateStepper();
  }
})();
