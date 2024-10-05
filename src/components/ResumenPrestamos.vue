<script setup lang="ts">
import { computed, ref } from 'vue'
import { Prestamo } from '../types'

const props = defineProps<{
  prestamos: Prestamo[]
}>()

const filtroWallet = ref('')

const prestamosFiltrados = computed(() => {
  return filtroWallet.value
    ? props.prestamos.filter(p => p.wallet.toLowerCase().includes(filtroWallet.value.toLowerCase()))
    : props.prestamos
})

const totalPrestado = computed(() => {
  return prestamosFiltrados.value.reduce((total, prestamo) => total + prestamo.monto, 0)
})

const totalGanancia = computed(() => {
  return prestamosFiltrados.value.reduce((total, prestamo) => {
    const interesAcumulado = calcularInteresAcumulado(prestamo)
    const totalPagado = calcularTotalPagado(prestamo)
    return total + Math.min(interesAcumulado, totalPagado)
  }, 0)
})

const calcularInteresAcumulado = (prestamo: Prestamo) => {
  const fechaPrestamo = new Date(prestamo.fecha)
  const hoy = new Date()
  const diasTranscurridos = Math.floor((hoy.getTime() - fechaPrestamo.getTime()) / (1000 * 3600 * 24))
  return prestamo.interesDiario * diasTranscurridos
}

const calcularTotalPagado = (prestamo: Prestamo) => {
  return prestamo.pagos.reduce((total, pago) => total + pago, 0)
}

const prestamosAgrupados = computed(() => {
  const agrupados: { [key: string]: { totalPrestado: number, totalGanancia: number } } = {}
  
  prestamosFiltrados.value.forEach(prestamo => {
    if (!agrupados[prestamo.wallet]) {
      agrupados[prestamo.wallet] = { totalPrestado: 0, totalGanancia: 0 }
    }
    agrupados[prestamo.wallet].totalPrestado += prestamo.monto
    const interesAcumulado = calcularInteresAcumulado(prestamo)
    const totalPagado = calcularTotalPagado(prestamo)
    agrupados[prestamo.wallet].totalGanancia += Math.min(interesAcumulado, totalPagado)
  })

  return agrupados
})
</script>

<template>
  <div class="resumen-prestamos">
    <h2>Resumen de Préstamos</h2>
    <div class="filtro">
      <label for="filtroWallet">Filtrar por Wallet:</label>
      <input type="text" id="filtroWallet" v-model="filtroWallet" placeholder="Ingrese wallet">
    </div>
    <div class="totales">
      <p><strong>Total Prestado:</strong> ${{ totalPrestado.toFixed(2) }}</p>
      <p><strong>Total Ganancia:</strong> ${{ totalGanancia.toFixed(2) }}</p>
    </div>
    <h3>Préstamos por Usuario</h3>
    <table>
      <thead>
        <tr>
          <th>Wallet</th>
          <th>Total Prestado</th>
          <th>Total Ganancia</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(datos, wallet) in prestamosAgrupados" :key="wallet">
          <td>{{ wallet }}</td>
          <td>${{ datos.totalPrestado.toFixed(2) }}</td>
          <td>${{ datos.totalGanancia.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.resumen-prestamos {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f0f0f0;
  border-radius: 8px;
}

.filtro {
  margin-bottom: 1rem;
}

.filtro label {
  margin-right: 0.5rem;
}

.filtro input {
  padding: 0.3rem;
  width: 200px;
}

.totales {
  margin-bottom: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
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
</style>