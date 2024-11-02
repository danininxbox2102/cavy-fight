<script setup>
import ProfileCmp from './ProfileCmp.vue';
import MiningCmp from './MiningCmp.vue'
</script>

<template>
    <div class="main-container">
        <ProfileCmp username="Новичек"/>
        <MiningCmp/>
    </div>
</template>

<style scoped>
.main-container{
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}
</style>