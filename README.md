# react-native-gamepad-controller
A react-native component to interface with gamepads/joysticks/controllers without using native code.

React Native doesn't provide gamepad support - this module attempts to add support for gamepads without using any native code. This works by embedding an invisible `WebView` - since HTML5 has the gamepad API, these events can be propagated up from the embedded webpage, through the `WebView` component, and into whatever React Native component you want.

## Installation
`npm install react-native-gamepad-controller`

## Usage

Here's a minimal example:
```javascript
import React from 'react';
import { Text, View } from 'react-native';
import GamepadController from 'react-native-gamepad-controller';

export default class App extends React.Component {
	constructor(){
		super();
		this.state = {gamepad: 'Not connected. Try pressing a key'};
	}

	onGamepadData(data){
		this.setState({gamepad: JSON.stringify(data)});
	}

	render() {
		return (
			<View>
				<GamepadController onData={(data)=>{ this.onGamepadData(data) }} />
				<Text>{this.state.gamepad}</Text>
			</View>
		);
	}
}
```
A more detailed example/demo is available in the `example/` folder.

**NOTE**: This has been tested an working on Android devices with a generic Bluetooth controller, but it has not been tested on iOS.

## Contributing
Pull requests are welcome!