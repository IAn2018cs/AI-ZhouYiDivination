<template>
  <div id="app" class="chinese-style">
    <div class="container">
      <h1>周易占卜</h1>
      <div class="input-group">
        <input v-model="question" placeholder="请输入您的问题" :disabled="isLoading">
        <button @click="performDivination" :disabled="!question || isLoading">
          {{ isLoading ? '占卜中...' : '占卜' }}
        </button>
      </div>
      <div v-if="isLoading" class="loading">
        <div class="spinner"></div>
        <p>正在解读天机，请稍候...</p>
      </div>
      <div v-if="svgResult" class="result">
        <img v-if="svgResult" :src="svgResult" alt="占卜结果" class="divination-image" @load="onImageLoad" />
        <div class="button-group">
          <button @click="saveImage">保存图片</button>
        </div>
      </div>
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <p>{{ modalMessage }}</p>
          <button @click="closeModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./App.js"></script>
<style src="./App.css"></style>
