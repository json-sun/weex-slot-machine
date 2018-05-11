<template>
  <div class="wrapper">
    <text class="title">Weex Slot-Machine</text>
    <text class="sub-title">( Weex 老虎机 )</text>
    <div class="content">
      <SlotMachine ref="slot-machine" @wxSlotMachineStateChanged="stateChanged"></SlotMachine>
    </div>
    <div class="control">
      <div class="btn start" @click="start" :style="{ backgroundColor: state === 'idle' ? '#666' : '#999' }">
        <text class="btn-text">Start</text>
      </div>
      <div class="btn stop" @click="stop" :style="{ backgroundColor: state === 'spin' ? '#666' : '#999' }">
        <text class="btn-text">Stop</text>
      </div>
    </div>
  </div>
</template>

<script>
import SlotMachine from './slot-machine';

export default {
  name: 'App',
  components: {
    SlotMachine
  },
  data: () => ({
    state: 'idle'
  }),
  methods: {
    start() {
      this.$refs['slot-machine'].spin([1]);
    },
    stop() {
      this.$refs['slot-machine'].stop();
    },
    stateChanged(state) {
      this.state = state;
    }
  }
}
</script>

<style scoped>
  .wrapper {
    align-items: center;
  }

  .title {
    font-size: 48px;
    text-align: center;
    color: #333333;
    margin-top: 200px;
  }

  .sub-title {
    font-size: 32px;
    text-align: center;
    color: #999999;
    margin-top: 20px;
  }

  .content {
    align-items: center;
    margin-top: 60px;
  }

  .control {
    margin-top: 60px;
    width: 500px;
    flex-direction: row;
    justify-content: space-between;
  }

  .btn {
    width: 200px;
    height: 100px;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
  }

  .btn-text {
    color: #FFF;
    font-size: 38px;
  }
</style>
