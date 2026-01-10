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
    special: /[@$!%*?&._-]/.test(pwd)
  };
});

const isPasswordValid = computed(() => {
  const r = passwordRules.value;
  return r.length && r.uppercase && r.number && r.special;
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) file.value = target.files[0] || null;
};

const uploadFileProcess = async (token: string) => {
  statusMsg.value = 'Usuario creado. Leyendo archivo JSON...';

  if (!file.value) throw new Error("No hay archivo seleccionado");

  const fileContent = await file.value.text();
  let jsonData;

  try {
    jsonData = JSON.parse(fileContent);
  } catch (e) {
    throw new Error("El archivo no es un JSON válido.");
  }

  statusMsg.value = 'Enviando datos...';

  await api.post('/followers/upload', jsonData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    params: { accountName: accountName.value }
  });
};

const handleRegisterAndUpload = async () => {
  if (!isUserCreated.value && !isPasswordValid.value) {
    statusMsg.value = "⚠️ La contraseña no es segura.";
    isError.value = true;
    return;
  }
  if (!file.value) {
    statusMsg.value = "⚠️ Falta el archivo JSON.";
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

      console.log('Respuesta Registro:', registerResponse.data);

      tokenToUse = registerResponse.data.token;

      if (!tokenToUse) {
        throw new Error("El backend no devolvió un token válido.");
      }

      isUserCreated.value = true;
      tempToken.value = tokenToUse;
    }

    await uploadFileProcess(tokenToUse);

    localStorage.setItem('jwt_token', tokenToUse);

    statusMsg.value = '✅ ¡Cuenta y Datos listos! Entrando...';
    setTimeout(() => router.push('/dashboard'), 1500);

  } catch (error: any) {
    console.error(error);
    isError.value = true;
    isLoading.value = false;

    if (isUserCreated.value) {
      statusMsg.value = '⚠️ Usuario creado, pero falló el envío del JSON. Reintenta subir el archivo.';
    } else {
      statusMsg.value = error.response?.data?.message || '❌ Error al crear el usuario.';
    }
  } finally {
    if (!isError.value) {
      isLoading.value = true;
    } else {
      isLoading.value = false;
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
            <div class="row">
              <div class="input-wrapper">
                <span class="icon">👤</span>
                <input v-model="accountName" type="text" placeholder="Usuario IG" required class="styled-input" />
              </div>
            </div>

            <div class="input-wrapper">
              <span class="icon">✉️</span>
              <input v-model="email" type="email" placeholder="Correo Electrónico" required class="styled-input" />
            </div>

            <div class="input-wrapper">
              <span class="icon">🔒</span>
              <input v-model="password" type="password" placeholder="Contraseña" class="styled-input"
                :class="{ 'input-error': password && !isPasswordValid }" />
            </div>

            <div v-if="password" class="password-checklist fade-in">
              <p class="requirements-title">Requisitos de seguridad:</p>
              <ul>
                <li :class="{ 'met': passwordRules.length }">
                  <span class="check-icon">{{ passwordRules.length ? '✅' : '○' }}</span> Mín. 8 caracteres
                </li>
                <li :class="{ 'met': passwordRules.uppercase }">
                  <span class="check-icon">{{ passwordRules.uppercase ? '✅' : '○' }}</span> Una mayúscula
                </li>
                <li :class="{ 'met': passwordRules.number }">
                  <span class="check-icon">{{ passwordRules.number ? '✅' : '○' }}</span> Un número
                </li>
                <li :class="{ 'met': passwordRules.special }">
                  <span class="check-icon">{{ passwordRules.special ? '✅' : '○' }}</span> Símbolo (@$!%*?&._-)
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="retry-message">
            <p>👤 Usuario creado: <strong>{{ email }}</strong></p>
            <p>Falta enviar los datos para terminar.</p>
          </div>

          <div class="file-area">
            <div class="file-icon">📂</div>
            <label>Sube <code>followers_1.json</code></label>
            <input type="file" @change="handleFileUpload" accept=".json" class="file-input" required />
          </div>

          <button type="submit" class="btn-primary" :disabled="isLoading || (!isUserCreated && !isPasswordValid)">
            {{ isLoading ? 'Procesando...' : (isUserCreated ? 'Reintentar Envío' : 'Crear y Analizar') }}
          </button>
        </form>

        <p v-if="statusMsg" :class="isError ? 'msg-error' : 'msg-success'" class="status-box">
          {{ statusMsg }}
        </p>

        <div class="footer-links">
          <p>¿Ya tienes cuenta?</p>
          <router-link to="/login" class="login-link">Inicia sesión</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-root {
  width: 100%;
  font-family: 'Segoe UI', sans-serif;
}

.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
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
  filter: blur(60px);
  opacity: 0.5;
  animation: moveBlob 10s infinite alternate ease-in-out;
}

.blob-1 {
  width: 80vw;
  height: 80vw;
  background-color: #ffc1e3;
  top: -20%;
  left: -20%;
}

.blob-2 {
  width: 70vw;
  height: 70vw;
  background-color: #fff0f5;
  bottom: -20%;
  right: -20%;
  animation-delay: -5s;
}

@keyframes moveBlob {
  0% {
    transform: translate(0, 0) scale(1);
  }

  100% {
    transform: translate(20px, 20px) scale(1.1);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(233, 30, 99, 0.15);
  width: 100%;
  max-width: 450px;
  position: relative;
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-link {
  position: absolute;
  top: 20px;
  left: 20px;
  text-decoration: none;
  color: #c2185b;
  font-size: 0.9em;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: transform 0.2s;
}

.back-link:hover {
  transform: translateX(-3px);
  color: #880e4f;
}

.ghost-animation {
  font-size: 3.5em;
  margin-top: 15px;
  margin-bottom: 5px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 5px 5px rgba(233, 30, 99, 0.2));
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

h1 {
  margin: 0;
  color: #880e4f;
  font-size: 1.8em;
  font-weight: 800;
}

.subtitle {
  color: #c2185b;
  margin-top: 5px;
  margin-bottom: 25px;
  font-size: 0.95em;
  opacity: 0.8;
}

.row {
  display: flex;
  gap: 15px;
  width: 100%;
  margin-bottom: 0;
}

.input-wrapper {
  position: relative;
  margin-bottom: 15px;
  width: 100%;
}

.icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1em;
  pointer-events: none;
  opacity: 0.7;
}

.styled-input {
  width: 100%;
  padding: 14px 14px 14px 45px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  font-size: 15px;
  background: rgba(255, 255, 255, 0.8);
  color: #880e4f;
  box-sizing: border-box;
  transition: all 0.3s ease;
  outline: none;
}

.styled-input:focus {
  background: white;
  border-color: #e91e63;
  box-shadow: 0 0 0 4px rgba(233, 30, 99, 0.1);
}

.styled-input::placeholder {
  color: #d81b60;
  opacity: 0.5;
}

.input-error {
  border-color: #ef4444 !important;
  background-color: #fff5f5 !important;
}

.password-checklist {
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 16px;
  margin-top: -5px;
  margin-bottom: 20px;
  text-align: left;
  font-size: 0.85rem;
  border: 1px solid #fbcfe8;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.requirements-title {
  margin: 0 0 8px 0;
  font-weight: 700;
  color: #db2777;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.password-checklist ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.password-checklist li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  color: #9d174d;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.password-checklist li.met {
  color: #059669;
  font-weight: 700;
  opacity: 1;
}

.check-icon {
  font-size: 1.1em;
  width: 20px;
  text-align: center;
}

.file-area {
  background: rgba(255, 255, 255, 0.5);
  border: 2px dashed #f48fb1;
  border-radius: 16px;
  padding: 15px;
  margin: 15px 0 20px 0;
  text-align: left;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 0.3s;
}

.file-area:hover {
  background: rgba(255, 255, 255, 0.8);
}

.file-icon {
  font-size: 2em;
  margin-bottom: 5px;
}

.file-area label {
  font-weight: 700;
  font-size: 0.9em;
  margin-bottom: 8px;
  color: #c2185b;
  display: block;
}

.file-area code {
  background: #fce4ec;
  padding: 2px 6px;
  border-radius: 4px;
  color: #880e4f;
}

.file-input {
  margin-top: 5px;
  font-size: 0.85em;
  width: 100%;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background-color: #e91e63;
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  font-size: 1.1em;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background-color: #c2185b;
  transform: translateY(-2px);
}

.btn-primary:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-primary:disabled {
  background-color: #f48fb1;
  cursor: not-allowed;
  opacity: 0.7;
}

.status-box {
  padding: 10px;
  border-radius: 8px;
  margin-top: 15px;
  font-size: 0.9em;
  font-weight: 600;
}

.msg-error {
  background: #ffebee;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
}

.msg-success {
  background: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.footer-links {
  margin-top: 25px;
  font-size: 0.95em;
  color: #c2185b;
}

.login-link {
  color: #e91e63;
  text-decoration: none;
  font-weight: 800;
  display: inline-block;
  margin-top: 5px;
}

.login-link:hover {
  text-decoration: underline;
}

.retry-message {
  background: rgba(255, 255, 255, 0.6);
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 15px;
  color: #880e4f;
}

@media (max-width: 480px) {
  .row {
    flex-direction: column;
    gap: 0;
  }

  .glass-card {
    padding: 30px 20px;
  }
}
</style>
