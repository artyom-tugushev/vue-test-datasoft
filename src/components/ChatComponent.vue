<template>
  <div class="chat-container">
    <div class="chat-header">
      <div class="flex align-items-center justify-content-between">
        <div class="title bebas-neue green">LIVE CHAT</div>
        <img class="pb-2" src="../assets/images/info.svg" />
      </div>
      <div class="border-1 border-700"></div>
    </div>
    <div class="chat-messages" ref="chatMessages">
      <div
        :class="{ active: message.isActive }"
        class="message"
        v-for="(message, index) in messages"
        :key="message.id"
      >
        <div class="montserrat-400 text-white">{{ message.name }}</div>
        <div class="montserrat-400 text-sm text-400 mt-2">
          {{ message.message }}
        </div>
      </div>
    </div>

    <div class="input m-3 flex align-items-center justify-content-between">
      <img src="../assets/images/question.svg" />
      <p-inputtext
        placeholder="Введите сообщение"
        id="inputValue"
        type="text"
        v-model="inputValue"
        class="input-text text-white montserrat-400 px-0"
      ></p-inputtext>

      <div class="flex align-items-center gap-1">
        <img src="../assets/images/smile.svg" />
        <img src="../assets/images/send.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import messages from "../data/messages.js";

export default {
  components: {
    "p-inputtext": InputText,
  },
  data() {
    return {
      inputValue: null,
      messages: messages,
    };
  },
  methods: {
    scrollToBottom() {
      const chat = this.$refs.chatMessages;
      chat.scrollTo({
        top: chat.scrollHeight,
        behavior: "smooth",
      });
    },
  },
  mounted() {
    this.scrollToBottom();
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 28px;
  line-height: 100%;
}
.chat-header {
  padding: 23px 14px 0px 14px;
}
.input {
  padding: 6px 10px;
  background-color: #343551;
  border-radius: 100px;
}
.input-text {
  border: 0;
  background-color: #343551;
}
.input-text:focus {
  outline: none;
}

/* cтили для чата */
.chat-container {
  width: 353px;
  height: 523px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #262740;
}
.chat-messages {
  overflow-y: scroll;
  flex-grow: 1;
}
.message {
  margin-bottom: 8px;
  border-left: 6px solid #262740;
  background-color: #262740;
  padding: 8px;
  word-wrap: break-word;
}
.active {
  background-color: #343551;
  border-left: 6px solid #0bd28a !important;
}
</style>
