<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const accountName = ref('');
const email = ref('');
const password = ref('');
const file = ref<File | null>(null);
const isLoading = ref(false);
const statusMsg = ref('');
const isError = ref(false);
const router = useRouter();

const isUserCreated = ref(false);
const tempToken = ref('');

const passwordRules = computed(() => {
  const pwd = password.value;
  return {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    number: /[0-9]/.test(pwd),
  };
});

const isPasswordValid = computed(() => {
  const r = passwordRules.value;
  return r.length && r.uppercase && r.number;
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files?.item(0) ?? null;
  } else {
    file.value = null;
  }
};

const uploadFileProcess = async (token: string) => {
  statusMsg.value = 'Usuario creado. Preparando archivo ZIP...';

  if (!file.value) throw new Error("No hay archivo seleccionado");

  if (!file.value.name.toLowerCase().endsWith('.zip')) {
    throw new Error("El archivo debe ser formato .zip");
  }

  statusMsg.value = 'Subiendo y analizando datos (esto puede tardar unos segundos)...';

  const formData = new FormData();
  formData.append('file', file.value);

  await api.post('/followers/upload', formData, {
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: { accountName: accountName.value }
  });
};

const handleRegisterAndUpload = async () => {
  if (!isUserCreated.value && !isPasswordValid.value) {
    statusMsg.value = "⚠️ La contraseña no cumple los requisitos.";
    isError.value = true;
    return;
  }
  if (!file.value) {
    statusMsg.value = "⚠️ Falta el archivo ZIP.";
    isError.value = true;
    return;
  }

  isLoading.value = true;
  isError.value = false;

  try {
    let tokenToUse = tempToken.value;

    if (!isUserCreated.value) {
      statusMsg.value = 'Creando cuenta...';
      const registerResponse = await api.post('/auth/register', {
        email: email.value,
        password: password.value
      });

      tokenToUse = registerResponse.data.token;

      if (!tokenToUse) {
        throw new Error("El servidor no devolvió un token válido.");
      }

      isUserCreated.value = true;
      tempToken.value = tokenToUse;
    }

    await uploadFileProcess(tokenToUse);

    localStorage.setItem('jwt_token', tokenToUse);

    statusMsg.value = '✅ ¡Cuenta y Datos listos! Entrando...';
    setTimeout(() => {
      router.push({ path: '/dashboard', query: { welcome: 'true' } });
    }, 1500);

  } catch (error: any) {
    console.error(error);
    isError.value = true;
    isLoading.value = false;

    if (isUserCreated.value) {
      statusMsg.value = '⚠️ Usuario creado, pero falló el envío del ZIP. Reintenta subir el archivo.';
    } else {
      statusMsg.value = error.response?.data?.message || '❌ Error al crear el usuario.';
    }
  } finally {
    if (!isError.value) {
      isLoading.value = true;
    }
  }
};
</script>

<template>
  <div class="page-root">
    <div class="fixed-background">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="scrollable-content">
      <div class="glass-card fade-in-up">
        <router-link to="/" class="back-link">
          <span class="arrow">←</span> Inicio
        </router-link>

        <div class="ghost-animation">👻</div>

        <h1>Crear Cuenta</h1>
        <p class="subtitle">Analiza tu Instagram hoy</p>

        <form @submit.prevent="handleRegisterAndUpload">

          <div v-if="!isUserCreated">
            <div class="input-wrapper">
              <span class="icon">👤</span>
              <input v-model="accountName" type="text" placeholder="Usuario IG (ej: @tunombre)" required
                class="styled-input" />
            </div>

            <div class="input-wrapper">
              <span class="icon">✉️</span>
              <input v-model="email" type="email" placeholder="Correo Electrónico" required class="styled-input" />
            </div>

            <div class="input-wrapper">
              <span class="icon">🔒</span>
              <input v-model="password" type="password" placeholder="Contraseña segura" class="styled-input"
                :class="{ 'input-error': password && !isPasswordValid }" />
            </div>

            <div v-if="password" class="password-checklist fade-in">
              <p class="requirements-title">Seguridad de la contraseña:</p>
              <ul>
                <li :class="{ 'met': passwordRules.length }">
                  <span class="check-icon">{{ passwordRules.length ? '✅' : '○' }}</span> Mín. 8 caracteres
                </li>
                <li :class="{ 'met': passwordRules.uppercase }">
                  <span class="check-icon">{{ passwordRules.uppercase ? '✅' : '○' }}</span> Una letra mayúscula
                </li>
                <li :class="{ 'met': passwordRules.number }">
                  <span class="check-icon">{{ passwordRules.number ? '✅' : '○' }}</span> Un número
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="retry-message fade-in">
            <div class="retry-icon">👤</div>
            <p>Cuenta creada: <strong>{{ email }}</strong></p>
            <p class="small-text">Sube tu archivo para completar el análisis.</p>
          </div>

          <div class="upload-container">
            <div class="file-area" :class="{ 'has-file': file }">
              <input type="file" @change="handleFileUpload" accept=".zip" class="file-input-hidden" required
                :disabled="isLoading" id="zip-upload" />
              <label for="zip-upload" class="file-label">
                <span class="file-icon">{{ file ? '📦' : '📂' }}</span>
                <span v-if="!file" class="file-text">Sube tu archivo <code>.zip</code> de Instagram</span>
                <span v-else class="file-text success-text">{{ file.name }}</span>
                <span v-if="!file" class="file-subtext">Toca para explorar</span>
                <span v-else class="file-subtext">Archivo seleccionado. ¡Listo!</span>
              </label>
            </div>
          </div>

          <button type="submit" class="btn-primary"
            :disabled="isLoading || (!isUserCreated && !isPasswordValid) || !file">
            <span v-if="isLoading" class="loader"></span>
            {{ isLoading ? 'Procesando...' : (isUserCreated ? 'Continuar Análisis' : 'Crear y Analizar') }}
          </button>
        </form>

        <div v-if="statusMsg" :class="['status-box', isError ? 'msg-error' : 'msg-success', 'fade-in']">
          {{ statusMsg }}
        </div>

        <div class="footer-links">
          <p>¿Ya tienes cuenta?</p>
          <router-link to="/login" class="login-link">Inicia sesión aquí</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.page-root {
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fce4ec 0%, #fbcfe8 100%);
  z-index: -1;
  overflow: hidden;
}

.scrollable-content {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: moveBlob 12s infinite alternate ease-in-out;
}

.blob-1 {
  width: 70vw;
  height: 70vw;
  background-color: #f9a8d4;
  top: -10%;
  left: -10%;
}

.blob-2 {
  width: 60vw;
  height: 60vw;
  background-color: #fdf2f8;
  bottom: -10%;
  right: -10%;
  animation-delay: -6s;
}

@keyframes moveBlob {
  0% {
    transform: translate(0, 0) scale(1);
  }

  100% {
    transform: translate(30px, 30px) scale(1.05);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 40px 35px;
  text-align: center;
  box-shadow: 0 10px 40px -10px rgba(233, 30, 99, 0.2);
  width: 100%;
  max-width: 420px;
  position: relative;
}

.back-link {
  position: absolute;
  top: 25px;
  left: 25px;
  text-decoration: none;
  color: #9d174d;
  font-size: 0.9em;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.back-link:hover {
  transform: translateX(-4px);
  color: #be185d;
}

.ghost-animation {
  font-size: 3.5em;
  margin-top: 10px;
  margin-bottom: 5px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 8px rgba(233, 30, 99, 0.25));
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

h1 {
  margin: 0;
  color: #831843;
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #be185d;
  margin-top: 5px;
  margin-bottom: 30px;
  font-size: 0.95rem;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  margin-bottom: 16px;
  width: 100%;
}

.icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1em;
  color: #9d174d;
  opacity: 0.8;
  pointer-events: none;
}

.styled-input {
  width: 100%;
  padding: 15px 15px 15px 48px;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
  background: white;
  color: #4c1d95;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  outline: none;
}

.styled-input:focus {
  border-color: #f472b6;
  box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.15);
}

.styled-input::placeholder {
  color: #94a3b8;
  font-weight: 400;
}

.input-error {
  border-color: #f87171 !important;
  background-color: #fef2f2 !important;
}

.password-checklist {
  background: white;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 20px;
  text-align: left;
  border: 1px solid #fbcfe8;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.requirements-title {
  margin: 0 0 10px 0;
  font-weight: 700;
  color: #be185d;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.password-checklist ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.password-checklist li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.password-checklist li.met {
  color: #10b981;
}

.check-icon {
  font-size: 1.1em;
  width: 20px;
  text-align: center;
}

/* REDISEÑO FILE UPLOAD */
.upload-container {
  margin: 10px 0 25px 0;
}

.file-input-hidden {
  display: none;
  /* Ocultamos el input feo del navegador */
}

.file-area {
  background: rgba(255, 255, 255, 0.6);
  border: 2px dashed #f9a8d4;
  border-radius: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.file-area:hover {
  background: white;
  border-color: #f472b6;
  box-shadow: 0 8px 16px rgba(244, 114, 182, 0.1);
}

.file-area.has-file {
  border: 2px solid #10b981;
  background: #ecfdf5;
}

.file-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 25px 15px;
  cursor: pointer;
  width: 100%;
}

.file-icon {
  font-size: 2.5em;
  margin-bottom: 10px;
  transition: transform 0.3s;
}

.file-area:hover .file-icon {
  transform: translateY(-3px);
}

.file-text {
  font-weight: 700;
  font-size: 0.95rem;
  color: #9d174d;
  margin-bottom: 6px;
}

.file-text code {
  background: #fce7f3;
  padding: 2px 8px;
  border-radius: 6px;
  color: #be185d;
  font-family: monospace;
}

.success-text {
  color: #059669;
  word-break: break-all;
}

.file-subtext {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #e91e63 0%, #db2777 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.05rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(233, 30, 99, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #f48fb1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loader {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.status-box {
  padding: 12px 16px;
  border-radius: 12px;
  margin-top: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
}

.msg-error {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.msg-success {
  background: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.footer-links {
  margin-top: 30px;
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.login-link {
  color: #db2777;
  text-decoration: none;
  font-weight: 700;
  display: inline-block;
  margin-top: 6px;
  transition: color 0.2s;
}

.login-link:hover {
  color: #9d174d;
  text-decoration: underline;
}

.retry-message {
  background: white;
  padding: 15px;
  border-radius: 16px;
  margin-bottom: 20px;
  color: #831843;
  border: 1px solid #fbcfe8;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.retry-icon {
  font-size: 2em;
  margin-bottom: 5px;
}

.retry-message p {
  margin: 2px 0;
  font-weight: 500;
  font-size: 0.95rem;
}

.small-text {
  font-size: 0.8rem !important;
  color: #64748b;
  margin-top: 6px !important;
}

.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .glass-card {
    padding: 35px 20px;
    border-radius: 20px;
  }

  h1 {
    font-size: 1.7rem;
  }
}
</style>
