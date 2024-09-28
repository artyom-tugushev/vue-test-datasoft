<template>
  <div class="header">
    <div class="container">
      <img class="pt-2" src="../src/assets/images/data-forum-logo.svg" />
    </div>
  </div>

  <div class="container">
    <div class="title bebas-neue green mt-6 mb-2">
      ЗАЛ {{ roomData.name?.toUpperCase() }}
    </div>
    <div class="flex justify-content-between align-items-center">
      <video
        width="930"
        height="523"
        controls
        poster="./assets/images/broadcast-preview.png"
        src="https://www.w3schools.com/html/movie.mp4"
        preload="metadata"
      ></video>
      <chat></chat>
    </div>

    <div :class="statusClass" class="title status bebas-neue ml-4 my-5">
      {{ currentBroadcastStatus }}
    </div>
  </div>
  <events :room-data="roomData" :active-event-id="activeEventId"></events>
</template>

<script>
import axios from "axios";
import { io } from "socket.io-client";
import chat from "./components/ChatComponent.vue";
import events from "./components/EventsComponent.vue";

export default {
  components: {
    chat,
    events,
  },
  data() {
    return {
      roomData: [],
      roomCode: "avrora",
      eventCode: "AAAAA11",
      socket: null,
      activeEventId: null,
      roomStatus: "",
      currentBroadcastStatus: null,
      statusMessages: {
        active: (title) => `АКТИВНАЯ СЕССИЯ: ${title}`,
        soon: "ТРАНСЛЯЦИЯ СКОРО НАЧНЕТСЯ",
        paused: "ТРАНСЛЯЦИЯ ПРИОСТАНОВЛЕНА",
        ended: "ТРАНСЛЯЦИЯ ЗАКОНЧЕНА",
      },
    };
  },
  watch: {
    roomStatus() {
      this.updateBroadcastStatus();
    },
    activeEventId() {
      this.updateBroadcastStatus();
    },
  },
  computed: {
    statusClass() {
      const status = this.currentBroadcastStatus;
      if (status?.includes("АКТИВНАЯ СЕССИЯ")) {
        return "green";
      } else if (
        status === this.statusMessages.soon ||
        status === this.statusMessages.paused
      ) {
        return "blue";
      } else if (status === this.statusMessages.ended) {
        return "red";
      }
      return "";
    },
  },
  methods: {
    async fetchRoomData() {
      const roomCode = this.roomCode;
      const eventCode = this.eventCode;
      try {
        const response = await axios.get(
          `https://test.wpdataforum.ru/events/${eventCode}/rooms/${roomCode}`
        );
        this.roomData = response.data;
        this.activeEventId = this.roomData.schedule.find(
          (event) => event.is_active === true
        ).id;
      } catch (error) {
        console.error(error);
      }
    },
    setupSocket() {
      this.socket = io("https://test.wpdataforum.ru", {
        transports: ["websocket", "polling"],
      });
      // подключаемся к сокету
      this.socket.on("connect", () => {
        this.socket.emit("room", `${this.roomCode}_${this.eventCode}`);
      });
      // подписываеимся на события
      this.socket.on("current-event", (eventId) => {
        this.activateEvent(eventId);
      });
      this.socket.on("room-status", (data) => {
        this.updateRoomStatus(data);
      });
    },
    // обработчики событий
    activateEvent(eventId) {
      this.activeEventId = eventId;
      this.roomData.schedule.forEach((event) => {
        event.is_active = false;
      });
      const activeEvent = this.roomData.schedule.find(
        (event) => event.id === +eventId
      );
      if (activeEvent) {
        activeEvent.is_active = true;
      }
    },
    updateRoomStatus(status) {
      this.roomStatus = status;
      if (status === "start") {
        this.roomData.is_running = true;
        this.roomData.is_ended = false;
      } else if (status === "pause") {
        this.roomData.is_running = false;
        this.roomData.is_ended = false;
      } else if (status === "stop") {
        this.roomData.is_running = false;
        this.roomData.is_ended = true;
      }
    },

    updateBroadcastStatus() {
      const activeEvent = this.roomData.schedule.find(
        (event) => event.id === +this.activeEventId
      );
      const eventTitle = activeEvent?.item.title.trim().toUpperCase();

      if (this.roomData.is_running) {
        this.currentBroadcastStatus = this.statusMessages.active(eventTitle);
      } else if (
        !this.roomData.is_running &&
        !this.roomData.is_ended &&
        this.roomData.elapsed_time === "0"
      ) {
        this.currentBroadcastStatus = this.statusMessages.soon;
      } else if (
        !this.roomData.is_running &&
        !this.roomData.is_ended &&
        this.roomData.elapsed_time > "0"
      ) {
        this.currentBroadcastStatus = this.statusMessages.paused;
      } else if (this.roomData.is_ended) {
        this.currentBroadcastStatus = this.statusMessages.ended;
      }
    },
  },
  async mounted() {
    await this.fetchRoomData();
    this.setupSocket();
  },
};
</script>

<style lang="scss" scoped>
.header {
  height: 72px;
  background-color: #262740;
}
.title {
  font-size: 42px;
  line-height: 100%;
}
.status {
  position: relative;
}
.status:before {
  position: absolute;
  left: -24px;
  top: 4px;
  content: "•";
  margin-right: 16px;
  font-size: 48px;
}
</style>
