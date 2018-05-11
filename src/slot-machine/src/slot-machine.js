/**
 * CopyRight (C) 2018-2023 Github@Yanjiie Holding Limited.
 * Created by Yanjiie on 2018/05/09.
 */
import config from '../config';
import Reel from './reel';

class SlotMachineView {
	constructor (app, config) {
		this.app = app;
		this.reelsCount = config.slotMachine.width;
		this.symbolCount = config.slotMachine.height;
		this.reels = [];
		this.state = config.slotMachineStates.IDLE;

		this.initialize();
	}

	initialize () {
		for (let i = 0; i < this.reelsCount; i++) {
			this.reels.push(new Reel(this.app.symbols));
		}
	}

	setElements(elements) {
		for (let i = 0; i < this.reels.length; i++) {
			this.reels[i].element = elements[i];
		}
	}

	updateData (data) {
		for (let i = 0; i < this.reels.length; i++) {
			this.reels[i].symbols = data.reels[i];
			this.reels[i].stopSymbols = data.reels[i];
		}
	}

	updateEndData (data) {
		for (let i = 0; i < this.reels.length; i++) {
			this.reels[i].stopSymbols = data.reels[i];
		}
	}

	spin () {
		this.state = config.slotMachineStates.SPIN;
		for (let i = 0; i < this.reelsCount; i++) {
			const delay = i * 200;
			setTimeout(() => { this.reels[i].spin(); }, delay);
		}
	}

	stop() {
		let stopCount = 0;
		return new Promise(resolve => {
			this.state = config.slotMachineStates.STOPPING;
			for (let i = 0; i < this.reelsCount; i++) {
				const delay = i * 1000;
				setTimeout(() => { 
					this.reels[i].stop().then(() => {
						stopCount++;
						if (stopCount === this.reelsCount) {
							this.state = config.slotMachineStates.IDLE;
							resolve();
						}
					}); 
				}, delay);
			}
		});
	}
}

export default SlotMachineView;