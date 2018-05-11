/**
 * CopyRight (C) 2018-2023 Github@Yanjiie Holding Limited.
 * Created by Yanjiie on 2018/05/09.
 */
import config from '../config';
import Binding from 'weex-bindingx';

/* global weex */
const animation = weex.requireModule('animation');
const platform = weex.config.env.platform;

const cubicBezier = {
	easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
	easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
	easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)'
};

class Reel {
	constructor(symbols) {
		this.spinningSpeed = config.slotMachine.spinSpeed;
		this.reelSpinMargin = config.slotMachine.reelMargin;
		this.height = config.slotMachine.height;
		this.symbolSize = config.slotMachine.symbolWidth;
		this.availableSymbols = symbols;

		this.spinningState = config.spinningStates.IDLE;
		this.position = 0;
		this.symbols = [];
		this.stopSymbols = [];
		this.element = null;
		this.infinitely = false;

		this.reelHeight = this.height * this.symbolSize;
		this.reelTapeHeight = this.availableSymbols.length * this.symbolSize;
	}

	isIdle() {
		return this.spinningState === config.spinningStates.IDLE;
	}

	spin() {
		this.spinningState = config.spinningStates.STARTING;
		this.loop();
	}

	stop() {
		this.spinningState = config.spinningStates.STOPPING;
		return this.stopping();
	}

	loop() {
		this.excuAnimate(-this.reelSpinMargin, 400)
			.then(() => {
				return this.excuAnimate(this.reelHeight, 120, 'easeInCubic');
			})
			.then(() => {
				if (platform === 'Web') {
					this.looping = true;
					let infinitely = () => {
						this.excuAnimate(this.reelTapeHeight + this.reelHeight, 600).then(() => {
							setTimeout(() => {
								this.looping && infinitely();
							});
						});
					};
					infinitely();
				} else {
					this.excuAnimate(this.reelTapeHeight + this.reelHeight, 600);
					this.loopTimer = setInterval(() => {
						this.excuAnimate(this.reelTapeHeight + this.reelHeight, 600);
					}, 600);
				}
			});
	}

	stopping() {
		platform === 'Web' && (this.symbols = this.stopSymbols);
		
		clearInterval(this.loopTimer);
		this.looping = false;
		return this.excuAnimate(this.reelTapeHeight + this.reelHeight, 600).then(() => {
			return this.excuAnimate(this.reelTapeHeight * 2 + this.reelHeight, 7000, 'easeOutQuint');
		}).then(() => {
			this.symbols = this.stopSymbols;
			setTimeout(() => {
				this.position = 0;
				if (platform === 'Web') {
					this.element.$el.style.transform = 'translateY(0px)';
				} else {
					animation.transition(this.element, {
						styles: {
							transform: `translateY(${this.position}px)`
						},
						duration: 0
					});
				}
			}, 100);
		});
	}

	excuAnimate(nextPosition, duration, timingFunc = 'linear', c1, c2, c3, c4) {
		if (platform === 'Web') {
			return this.excuAnimateH5(nextPosition, duration, timingFunc);
		}
		return new Promise((resolve) => {
			let changeY = nextPosition - this.position;

			let expression = !(c1 && c2 && c3 && c4 && timingFunc === 'cubicBezier') ? 
				`${timingFunc}(t, ${this.position}, ${changeY}, ${duration})` : `cubicBezier(t, ${this.position}, ${changeY}, ${duration}, ${c1}, ${c2}, ${c3}, ${c4})`;

			let gesToken = Binding.bind({
				eventType: 'timing',
				exitExpression: `t>${duration}`,
				props: [{
					element: this.element.ref, 
					property:'transform.translateY',
					expression
				}]
			}, (e) => {
				if (e.state === 'exit') {
					Binding.unbind({
						eventType: 'timing',
						token: gesToken
					});
					this.position = nextPosition;
					if (this.position >= this.reelTapeHeight + this.reelHeight) {
						this.position = this.reelHeight;
					}
					resolve();
				}
			});
		});
	}

	excuAnimateH5 (nextPosition, duration, timingFunc = 'linear') {
		this.position = nextPosition;
		timingFunc = cubicBezier[timingFunc] || timingFunc;
		return new Promise((resolve) => {
			animation.transition(this.element, {
				styles: {
					transform: `translateY(${this.position}px)`
				},
				duration,
				timingFunction: timingFunc
			}, () => {
				if (this.position >= this.reelTapeHeight + this.reelHeight && this.position < this.reelTapeHeight * 2 + this.reelHeight) {
					this.position = this.reelHeight;
					animation.transition(this.element, {
						styles: {
							transform: `translateY(${this.position}px)`
						},
						duration: 0.0001
					}, () => {
						resolve();
					});
				} else {
					resolve();
				}
				resolve();
			});
		});
	}
}

export default Reel;