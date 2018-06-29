import React from 'react';
import { StyleSheet, Text, View, WebView } from 'react-native';
import GamepadController from 'react-native-gamepad-controller';

export default class App extends React.Component {
	constructor(){
		super();

		this.state = {gamepads: []};
	}

	onGamepadData(data){
		let gamepads = this.state.gamepads;
		gamepads[data.gamepadID] = data;
		this.setState({gamepads: gamepads});
	}

	onGamepadConnected(gamepadID){
		console.log('Connected gamepad', gamepadID);
	}

	render() {
		return (
			<View style={{flex:1, marginTop: 25, padding: 10}}>
				<GamepadController
					onConnect={(data) => { this.onGamepadConnected(data) }}
					onData={(data)=>{ this.onGamepadData(data) }}
				/>

				{
					this.state.gamepads.length == 0 ? (
						<Text>There are no connected gamepads. Make sure you're connected, then press some buttons</Text>
					):(
						<View>
							<Text>Gamepads: {this.state.gamepads.length}</Text>
							{
								this.state.gamepads.map((pad, i) => <ControllerView key={i} axes={pad.axes} buttons={pad.buttons} />)
							}
						</View>
					)
				}
			</View>
		);
	}
}

class ControllerView extends React.Component {
	render() {
		return (
			<View>
				<View>
				{
					this.props.axes.map((value, i) => <AxisBar key={i} value={value} text={'Axis ' + i + ': ' + value} />)
				}
				</View>

				<View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center'}}>{
					this.props.buttons.map((value, i) =>
						<Text key={i}
							style={{
								borderWidth:1,
								backgroundColor: value ? '#22f5': '#fff',
								borderColor: '#22f5',
								padding: 4,
								margin: 4,
								width: 32,
								borderRadius:16,
								textAlign: 'center',
							}}
						>{i}</Text>)
				}</View>
			</View>
		);
	}
}

class AxisBar extends React.Component {
	render() {
		let width = (50 + (this.props.value)*50) + '%';
		return (
			<View style={{margin: 2, borderColor: '#22f5', borderWidth: 1}}>
				<View style={{width: width, height: '100%', position:'absolute', backgroundColor: '#22f5'}}></View>
				<Text style={{textAlign:'center'}}>{this.props.text}</Text>
			</View>
		)
	}
}
