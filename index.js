import React from 'react';
import { View, WebView } from 'react-native';

var js = `
	var haveEvents = 'GamepadEvent' in window;
	var haveWebkitEvents = 'WebKitGamepadEvent' in window;
	var controllers = {};
	var rAF = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.requestAnimationFrame;

	var lastState;

	function connecthandler(e) {
		addgamepad(e.gamepad);
	}

	function addgamepad(gamepad) {
		var message = {
			'type': 'connect',
			'data': gamepad.index,
		};
		window.postMessage(JSON.stringify(message));

		controllers[gamepad.index] = gamepad;
		rAF(updateStatus);
	}

	function disconnecthandler(e) {
		removegamepad(e.gamepad);
	}

	function removegamepad(gamepad) {
		var message = {
			'type': 'disconnect',
			'data': gamepad.index,
		};
		window.postMessage(JSON.stringify(message));

		delete controllers[gamepad.index];
	}

	function updateStatus() {
		scangamepads();
		for (j in controllers) {
			var controller = controllers[j];
			var data = {
				gamepadID: j,
				buttons: [],
				axes: [],
			};

			for (var i=0; i<controller.buttons.length; i++) {
				var val = controller.buttons[i];
				var pressed = val == 1.0;
				if (typeof(val) == "object") {
					pressed = val.pressed;
					val = val.value;
				}
				data.buttons.push(pressed);
			}

			for (var i=0; i<controller.axes.length; i++) {
				data.axes.push(controller.axes[i].toFixed(4));
			}

			var stateJSON = JSON.stringify(data);
			if(stateJSON !== controller._lastState){
				var message = {
					'type': 'data',
					'data': data,
				};

				window.postMessage(JSON.stringify(message));
				lastState = data;
				controller._lastState = stateJSON;
			}
		}
		rAF(updateStatus);
	}

	function scangamepads() {
		var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
				if (!(gamepads[i].index in controllers)) {
					addgamepad(gamepads[i]);
				} else {
					controllers[gamepads[i].index] = gamepads[i];
				}
			}
		}
	}

	if (haveEvents) {
		window.addEventListener("gamepadconnected", connecthandler);
		window.addEventListener("gamepaddisconnected", disconnecthandler);
	} else if (haveWebkitEvents) {
		window.addEventListener("webkitgamepadconnected", connecthandler);
		window.addEventListener("webkitgamepaddisconnected", disconnecthandler);
	} else {
		setInterval(scangamepads, 500);
	}
`;

export default class GamepadController extends React.Component {
	parseMessage(data){
		data = JSON.parse(data);
		if(data.type == 'data'){
			if(this.props.onData) this.props.onData(data.data);
		}else if(data.type == 'connect'){
			if(this.props.onConnect) this.props.onConnect(data.data);
		}else if(data.type == 'disconnect'){
			if(this.props.onDisconnectt) this.props.onDisconnect(data.data);
		}
	}

	render() {
		return (
			<View style={{}}>
			<WebView
				source={{html: '<html><body>Loading...</body></html>'}}
				onMessage={(evt)=> this.parseMessage(evt.nativeEvent.data)}
				injectedJavaScript={js}
			/>
			</View>
		);
	}
}
