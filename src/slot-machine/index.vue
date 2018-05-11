<!-- CopyRight (C) 2018-2023 Github@Yanjiie Holding Limited. -->
<!-- Created by Yanjiie on 2018/05/09. -->
<template>
  <div 
    class="slot-machine--wrap"
    :style="{ width: `${width * itemSize}px`, height: `${height * itemSize}px` }">
    <div class="slot-machine--col" v-for="(reel, reelIndex) in slotMachine.reels" :key="reelIndex">
      <div class="col-wrap" :ref="`reel${reelIndex}`">
        <div class="col-symbol" v-for="(symbol, index) in reel.stopSymbols">
          <image class="col-symbol--img" :style="itemStyle" :src="getSymbolUrl(symbol)" />
        </div>
        <div class="col-symbol" v-for="(symbol) in symbols">
          <image class="col-symbol--img" :style="itemStyle" :src="symbol.url" />
        </div>
        <div class="col-symbol" v-for="(symbol) in symbols">
          <image class="col-symbol--img" :style="itemStyle" :src="symbol.url" />
        </div>
        <div class="col-symbol" v-for="(symbol, index) in reel.symbols">
          <image class="col-symbol--img" :style="itemStyle" :src="getSymbolUrl(symbol)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const modal = weex.requireModule('modal');

import SlotMacnineEngine from './src/engine';
import SlotMachineView from './src/slot-machine';
import symbols from './src/symbols';
import config from './config';

export default {
  name: 'SlotMachine',
  props: {
    width: {
      type: Number,
      default: 5
    },
    height: {
      type: Number,
      default: 3
    },
    itemSize: {
      type: Number,
      default: 100
    }
  },
  data: () => ({
    symbols,
    states: config.slotMachineStates,
    state: 'idle',
    engine: null,
    slotMachine: null
  }),
  computed: {
    itemStyle() {
      return {
        width: this.itemSize + 'px',
        height: this.itemSize + 'px'
      }
    }
  },
  created () {
    let mergeConfig = Object.assign({}, config, {
      slotMachine: {
        width: this.width,
        height: this.height,
        symbolWidth: this.itemSize
      }
    })
		this.engine = new SlotMacnineEngine(mergeConfig);
		this.slotMachine = new SlotMachineView(this, mergeConfig);

		this.engine.api.getConfig()
      .then((data) => this.slotMachine.updateData(data));
    
    let that = this;
    Object.defineProperty(this.slotMachine, 'state', {
      get() {
        return that.state;
      },
      set(newVal) {
        that.state = newVal;
        that.$emit('wxSlotMachineStateChanged', newVal);
      }
    });
  },
  mounted() {
    setTimeout(() => {
      this.slotMachine.setElements(Object.values(this.$refs).map(ref => ref[0]));
    }, 200);
  },
  methods: {
		spin(linesToWin) {
			if (this.slotMachine.state !== config.slotMachineStates.IDLE) {
				return;
      }
      // 确保胜利 更新胜利之后的图组
      linesToWin && this.engine.api.getSpinEndData(linesToWin).then((data) => {
        this.slotMachine.updateEndData(data);
      });
      // 开始滚动
      this.slotMachine.spin();
      this.$emit('wxSlotMachineSpining')
    },
    stop() {
      if (this.slotMachine.state !== config.slotMachineStates.SPIN) {
        return;
      }
      this.slotMachine.stop().then(() => {
        this.$emit('wxSlotMachineStopped')
      });
    },
    getSymbolUrl (key) {
      for (let i = 0; i < this.symbols.length; i++) {
        if (this.symbols[i].key === key) {
          return this.symbols[i].url;
        }
      }
    }
  }
}
</script>

<style scoped>
  .slot-machine--wrap {
    overflow: hidden;
    flex-direction: row;
    align-items: flex-end;
    background-color: #58595b;
  }
</style>


