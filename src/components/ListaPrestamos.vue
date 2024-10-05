<script setup lang="ts">
import { ref, computed } from 'vue'
import { Prestamo, PagoAbono } from '../types'

const props = defineProps<{
  prestamos: Prestamo[]
}>()

const emit = defineEmits<{
  (e: 'realizar-pago', pago: PagoAbono): void
}>()

const pagoMonto = ref<{ [key: number]: number }>({})

const calcularInteresAcumulado = (prestamo: Prestamo) => {
  const fechaPrestamo = new Date(prestamo.fecha)
  const hoy = new Date()
  const diasTranscurridos = Math.floor((hoy.getTime() - fechaPrestamo.getTime()) / (1000 * 3600 * 24))
  const interesAcumulado = prestamo.interesDiario * diasTranscurridos
  return interesAcumulado
}

const calcularTotalPagado = (prestamo: Prestamo) => {
  return prestamo.pagos.reduce((total, pago) => total + pago, 0)
}

const realizarPago = (prestamoId: number) => {
  const cantidad = pagoMonto.value[prestamoId]
  if (cantidad && cantidad > 0) {
    emit('realizar-pago', { prestamoId, cantidad })
    pagoMonto.value[prestamoId] = 0
  }
}

const saldoPendiente = computed(() => (prestamo: Prestamo) => {
  const interesAcumulado = calcularInteresAcumulado(prestamo)
  const totalPagado = calcularTotalPagado(prestamo)
  return prestamo.monto + interesAcumulado - totalPagado
})
</script>

<template>
  <div class="lista-prestamos">
    <h2>Préstamos Registrados</h2>
    <table v-if="prestamos.length > 0">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Monto</th>
          <th>Fecha</th>
          <th>Wallet</th>
          <th>Items</th>
          <th>Usuario Discord</th>
          <th>Interés Diario</th>
          <th>Interés Acumulado</th>
          <th>Total Pagado</th>
          <th>Saldo Pendiente</th>
          <th>Realizar Pago</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="prestamo in prestamos" :key="prestamo.id">
          <td>{{ prestamo.nombre }}</td>
          <td>{{ prestamo.monto.toFixed(2) }}</td>
          <td>{{ prestamo.fecha }}</td>
          <td>{{ prestamo.wallet }}</td>
          <td>{{ prestamo.items }}</td>
          <td>{{ prestamo.discordUser }}</td>
          <td>{{ prestamo.interesDiario.toFixed(2) }}</td>
          <td>{{ calcularInteresAcumulado(prestamo).toFixed(2) }}</td>
          <td>{{ calcularTotalPagado(prestamo).toFixed(2) }}</td>
          <td>{{ saldoPendiente(prestamo).toFixed(2) }}</td>
          <td>
            <input type="number" v-model="pagoMonto[prestamo.id]" min="0" step="0.01">
            <button @click="realizarPago(prestamo.id)">Pagar</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else>No hay préstamos registrados.</p>
  </div>
</template>

<style scoped>
.lista-prestamos {
  margin-top: 2rem;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

input[type="number"] {
  width: 80px;
  margin-right: 5px;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 3px;
}

button:hover {
  background-color: #45a049;
}
</style>