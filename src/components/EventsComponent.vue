<template>
  <div class="border-1 border-400 mb-3"></div>
  <div class="slider-wrapper">
    <p-button class="button left-button" @click="rightScroll()">
      <img src="../assets/images/left-button.svg" />
    </p-button>
    <div ref="sliderTrack" class="slider-track flex">
      <div
        class="flex"
        v-for="(event, index) of roomData.schedule"
        :key="event.id"
      >
        <div class="card flex">
          <div class="flex flex-column align-items-center">
            <img
              class="speaker-photo"
              :src="`https://dtf.wpdataforum.ru/api/files/${event.item.img}`"
            />
            <div
              :class="{
                'surface-400': isInactive[index],
                'blue-back': !isInactive[index] && !event.is_active,
                'green-back': event.is_active,
              }"
              class="time mt-5 p-1 text-xs"
            >
              {{ event.timerange[0].slice(0, -3) }} –
              {{ event.timerange[1].slice(0, -3) }}
              <div class="line border-1 border-400"></div>
            </div>
            <!-- <div>{{ event.is_active }}</div> -->
          </div>
          <div class="flex flex-column justify-content-center card-text ml-4">
            <div
              :class="{
                'text-400': isInactive[index],
                blue: !isInactive[index] && !event.is_active,
                green: event.is_active,
              }"
              class="montserrat-700 mb-2"
            >
              {{ event.item.title }}
            </div>

            <div
              :class="{
                'text-400': isInactive[index],
                'text-white': !isInactive[index],
              }"
              class="flex flex-column text-sm montserrat-400 gap-2"
            >
              <div>{{ event.item.subtitle }}</div>
              <div>{{ event.item.text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p-button class="button right-button" @click="leftScroll()">
      <img src="../assets/images/right-button.svg" />
    </p-button>
  </div>
</template>

<script>
import Button from "primevue/button";

export default {
  components: { "p-button": Button },
  props: {
    roomData: {
      type: Object,
      required: true,
    },
    activeEventId: {
      required: true,
    },
  },
  data() {
    return {
      cardWidth: 660,
      initialOffset: 300,
      isAnimating: false,
    };
  },
  watch: {
    activeEventId() {
      this.positionActiveCard();
    },
  },
  computed: {
    // трансляция, которая уже закончилась
    isInactive() {
      return this.roomData.schedule.map((event, index) => {
        return this.roomData.schedule.slice(index + 1).some((e) => e.is_active);
      });
    },
  },
  methods: {
    positionActiveCard() {
      const activeCardIndex = this.roomData.schedule.findIndex(
        (event) => event.is_active
      );
      if (activeCardIndex !== -1) {
        const newValue = this.initialOffset - activeCardIndex * this.cardWidth;
        this.$refs.sliderTrack.style.transform = `translateX(${newValue}px)`;
      }
    },

    leftScroll() {
      // даем анимации перемещения завершиться
      if (this.isAnimating) return;
      this.isAnimating = true;

      const currentTransform = window.getComputedStyle(
        this.$refs.sliderTrack
      ).transform;
      const currentTranslateX = parseInt(currentTransform.split(",")[4]);
      const totalCards = this.roomData.schedule.length;
      const maxOffset = -(totalCards * this.cardWidth - 660);
      const newValue = currentTranslateX - this.cardWidth;
      if (newValue >= maxOffset) {
        this.$refs.sliderTrack.style.transform = `translateX(${newValue}px)`;
      }

      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    },

    rightScroll() {
      if (this.isAnimating) return;
      this.isAnimating = true;

      const currentTransform = window.getComputedStyle(
        this.$refs.sliderTrack
      ).transform;
      const currentTranslateX = parseInt(currentTransform.split(",")[4]);
      const newValue = currentTranslateX + this.cardWidth;
      if (newValue <= this.initialOffset) {
        this.$refs.sliderTrack.style.transform = `translateX(${newValue}px)`;
      }

      setTimeout(() => {
        this.isAnimating = false;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
.slider-wrapper {
  overflow: hidden;
  position: relative;
}
.button {
  border: 0;
  background-color: #262740;
  width: 62px;
  height: 62px;
  border-radius: 32px;
  padding: 0;
  margin: 0;
  z-index: 2;
}
.left-button {
  position: absolute;
  left: 100px;
  bottom: -20px;
  transform: translateY(-50%);
}
.right-button {
  position: absolute;
  right: 100px;
  bottom: -20px;
  transform: translateY(-50%);
}
.slider-track {
  transform: translateX(300px);
  transition: transform 0.5s ease;
}
.card {
  padding: 15px;
  width: 660px;
}
.card-text {
  height: 120px;
}
.speaker-photo {
  width: 120px;
  height: 120px;
  border-radius: 100px;
  object-fit: cover;
}
.time {
  color: #fff !important;
  border-radius: 4px;
  position: relative;
}
.line {
  position: absolute;
  width: 100vw;
  top: 50%;
  left: -334px;
  transform: translateY(-50%);
  z-index: -1;
}
</style>
