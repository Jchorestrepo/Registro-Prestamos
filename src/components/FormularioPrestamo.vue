<script setup lang="ts">
import { ref, computed } from 'vue'
import { Prestamo } from '../types'

const emit = defineEmits<{
  (e: 'agregar-prestamo', prestamo: Prestamo): void
}>()

const nombre = ref('')
const monto = ref(0)
const fecha = ref('')
const wallet = ref('')
const items = ref('')
const discordUser = ref('')

const interesDiario = computed(() => monto.value * 0.005)

const agregarPrestamo = () => {
  if (nombre.value && monto.value > 0 && fecha.value && wallet.value && discordUser.value) {
    const nuevoPrestamo: Prestamo = {
      id: Date.now(),
      nombre: nombre.value,
      monto: monto.value,
      fecha: fecha.value,
      wallet: wallet.value,
      items: items.value,
      discordUser: discordUser.value,
      interesDiario: interesDiario.value
    }
    emit('agregar-prestamo', nuevoPrestamo)
    nombre.value = ''
    monto.value = 0
    fecha.value = ''
    wallet.value = ''
    items.value = ''
    discordUser.value = ''
  }
}
</script>

<template>
  <form @submit.prevent="agregarPrestamo" class="formulario-prestamo">
    <div class="form-group">
      <label for="nombre">Nombre del solicitante:</label>
      <input type="text" id="nombre" v-model="nombre" required>
    </div>
    <div class="form-group">
      <label for="monto">Monto del préstamo:</label>
      <input type="number" id="monto" v-model="monto" min="0" step="0.01" required>
    </div>
    <div class="form-group">
      <label for="fecha">Fecha del préstamo:</label>
      <input type="date" id="fecha" v-model="fecha" required>
    </div>
    <div class="form-group">
      <label for="wallet">Wallet:</label>
      <input type="text" id="wallet" v-model="wallet" required>
    </div>
    <div class="form-group">
      <label for="items">Items:</label>
      <textarea id="items" v-model="items" rows="3"></textarea>
    </div>
    <div class="form-group">
      <label for="discordUser">Usuario de Discord:</label>
      <input type="text" id="discordUser" v-model="discordUser" required>
    </div>
    <div class="form-group">
      <label>Interés diario (0.5%):</label>
      <span>{{ interesDiario.toFixed(2) }}</span>
    </div>
    <button type="submit">Registrar Préstamo</button>
  </form>
</template>

<style scoped>
.formulario-prestamo {
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>