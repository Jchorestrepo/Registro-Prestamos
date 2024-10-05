<script setup lang="ts">
import { ref } from 'vue'
import FormularioPrestamo from './components/FormularioPrestamo.vue'
import ListaPrestamos from './components/ListaPrestamos.vue'
import ResumenPrestamos from './components/ResumenPrestamos.vue'
import { Prestamo, PagoAbono } from './types'

const prestamos = ref<Prestamo[]>([])

const agregarPrestamo = (prestamo: Prestamo) => {
  prestamos.value.push({ ...prestamo, pagos: [] })
}

const realizarPago = (pago: PagoAbono) => {
  const prestamo = prestamos.value.find(p => p.id === pago.prestamoId)
  if (prestamo) {
    prestamo.pagos.push(pago.cantidad)
  }
}
</script>

<template>
  <div class="container">
    <h1>Sistema de Registro de Préstamos</h1>
    <FormularioPrestamo @agregar-prestamo="agregarPrestamo" />
    <ResumenPrestamos :prestamos="prestamos" />
    <ListaPrestamos :prestamos="prestamos" @realizar-pago="realizarPago" />
  </div>
</template>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}
</style>