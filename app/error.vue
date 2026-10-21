<template><ErrorContent :status="error.statusCode" /></template>

<script setup lang="ts">
import type { NuxtError } from '#app';
defineProps<{ error: NuxtError }>();
useSeoMeta({ title: 'Сторінку не знайдено', robots: 'noindex, nofollow' });
</script>
