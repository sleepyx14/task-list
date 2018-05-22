import React, { Component } from "react";
import TaskGroup from "./TaskGroup";

class App extends React.Component {
  constructor(props) {
    super(props);

	this.state = {
		showPage: true
	};

	this.handleClick = this.handleClick.bind(this);
	this.returnToMain = this.returnToMain.bind(this);
  }

	handleClick(e,data) {
		const id = e.target.className;
		const idRgx = /group_(.+)/;
		const val = id.match(idRgx);
		const clickIndex = val[1];

		sessionStorage.setItem('ws_index', JSON.stringify(clickIndex));
		sessionStorage.getItem("ws_index");

		this.setState({showPage: false});
	}

	returnToMain(){
		this.setState({showPage: true});
	}

	parsePayload(pl) {
		let taskGroups = {};
		let lGroups = [];

		pl.forEach((taskData,index) => {
			const group = taskData["group"];
			const completedAt = taskData["completedAt"];

			if(!lGroups.includes(group)){
				lGroups.push(group);
			}

			if(taskGroups[group]){
				taskGroups[group]["total"]++;
			}
			else{
				taskGroups[group] = {}
				taskGroups[group]["total"] = 1;
				taskGroups[group]["completed"] = 0;
			}


			if(completedAt !== null && completedAt !== undefined){
				taskGroups[group]["completed"]++;
			}

		});

		return {counts: taskGroups, groups: lGroups};
	}

	getPayload(){
		if (sessionStorage.getItem("ws_payload") === null) {
			const newPl = [
				{
					id: 1,
					group: "Purchases",
					task: "Go to the bank",
					dependencyIds: [],
					completedAt: null,
				},
				{
					id: 2,
					group: "Purchases",
					task: "Buy hammer",
					dependencyIds: [1],
					completedAt: null,
				},
				{
					id: 3,
					group: "Purchases",
					task: "Buy wood",
					dependencyIds: [1],
					completedAt: null,
				},
				{
					id: 4,
					group: "Purchases",
					task: "Buy nails",
					dependencyIds: [1],
					completedAt: null,
				},
				{
					id: 5,
					group: "Purchases",
					task: "Buy paint",
					dependencyIds: [1],
					completedAt: null,
				},
				{
					id: 6,
					group: "Build Airplane",
					task: "Hammer nails into wood",
					dependencyIds: [2, 3, 4],
					completedAt: null,
				},
				{
					id: 7,
					group: "Build Airplane",
					task: "Paint wings",
					dependencyIds: [5, 6],
					completedAt: null,
				},
				{
					id: 8,
					group: "Build Airplane",
					task: "Have a snack",
					dependencyIds: [11],
					completedAt: null,
				}
			];

			sessionStorage.setItem('ws_payload', JSON.stringify(newPl));
			sessionStorage.getItem("ws_payload");

		}

		const curPl = JSON.parse(sessionStorage.getItem("ws_payload"));

		return curPl;
	}

  render() {
	const payload = this.getPayload();
	const groupInfo = this.parsePayload(payload);
	const taskCounts = groupInfo["counts"];
	const groups = groupInfo["groups"];

	if(this.state.showPage === true){
		return (
			<div>
				<div id="main">
					<div id="mainLabel">Things To Do</div>
					<div id="mainBorder"></div>
						{groups.map( (groupname, index) => {
							return(
							<div className="group" key={"content_" + index}>
									<div className={"grayBorder group_" + groupname} key = {index} onClick={this.handleClick}>
											{groupname} <br/><span className={"task_count group_" + groupname}>{taskCounts[groupname]["completed"]} of {taskCounts[groupname]["total"]} COMPLETE</span>
									</div>
							</div>
							);
						})}

				</div>
			</div>

		);
	}
	else{
		return (
			<div id="main">
				<span id="TaskLabel">Task Group</span>
				<span id="GroupLabel" onClick={this.returnToMain}>ALL GROUPS</span>
					<div id="mainLabel"></div>
				<div id="mainBorder"></div>
				<TaskGroup/>
			</div>
		);
	}
  }
}

export default App;