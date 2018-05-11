/**
 * CopyRight (C) 2018-2023 Github@Yanjiie Holding Limited.
 * Created by Yanjiie on 2018/05/09.
 */
export default {
	slotMachine: {
		width: 5,
		height: 3,
		symbolWidth: 100,
		reelMargin: 40
	},

	slotMachineStates: {
		IDLE: 'idle',
		SPIN: 'spin',
		STOPPING: 'stopping',
		DISABLED: 'null'
	},
	
	spinningStates: {
		STARTING: 'starting',
		SPINNING: 'spinning',
		STOPPING: 'stopping',
		IDLE: 'idle'
	}
};