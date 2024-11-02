<script setup>
const data = defineProps(['rank','points','pointsRequired'])

</script>

<template>
    <div class="rank-body">
        <div class="text-cont">
            <h1 class="rank"> {{ data.rank }} </h1>
            <div class="rank-progress-wrap" ><h2 class="rank-progress">{{ data.points }} </h2><h2 class="rank-goal"> /{{ data.pointsRequired }} </h2></div>
        </div>
        <div class="progressbar-body">
            <div class="progressbar-progress">
                
            </div>
        </div>
    </div>
</template>


<style scoped>
.rank-body{
    width: fit-content;
    display: flex;
    flex-direction: column;
}

.text-cont{
    display: flex;
    justify-content: space-between;
}

.rank-progress-wrap{
    display: flex;
    align-items: center;
}

.rank{
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 20px;
    color: white;
}

.rank-progress{
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    font-size: 10px;
    color: white;
}

.rank-goal{
    font-family: Verdana, Geneva, Tahoma, sans-serif;  
    font-size: 10px;
    color: #4E4E4E;
}

.progressbar-body{
    position: relative;
    width: 200px;
    height: 12px;
    border-radius: 4px;
    background: #1A1E29;
}

.progressbar-progress{
    position: absolute;
    width: 53%;
    height: 12px;
    border-radius: 4px;
    background: linear-gradient(90deg, #0014FF, #FF2CDF);
}


</style>