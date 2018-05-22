import React, { Component } from "react";

class TaskGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			updateComponent: 0,
			statusNames: {
				0 : "incomplete",
				1 : "complete",
				2 : "locked"
			}
		}

	this.updatePayload = this.updatePayload.bind(this);
	}

	getGroupInfo(){
		const groupName = JSON.parse(sessionStorage.getItem("ws_index"));
		const payLoad = JSON.parse(sessionStorage.getItem("ws_payload"));

		let lGroupData = [];

		payLoad.forEach((taskData,index) => {
			if(groupName === taskData["group"]){
				// check for depandencies
				// if there are none:
				//	check completedAt value
				//		if it is set taks complete
				//		else task is incomplete
				// if there are depandencies:
				//	if Dependent task isn't loded:
				//		don't take it into account when determining current task status
				//	else if all depandencies are complete:
				//		then check completedAt at value of task
				//	else:
				//		task is considered locked until depedant task are complete

				// status values
				// 0 = Incomplete
				// 1 = Complete
				// 2 = Locked

				let dIds = taskData["dependencyIds"];

				// used count number of incomplete depedent task
				const reducer = (accum,td) => {
					const curID = td["id"];
					const complete = td["completedAt"];

					let st = 0;

					if(dIds.includes(curID) && (complete === null || complete === undefined)){
						st = 1;
					}
					return accum + st;
				};

				let status = payLoad.reduce(reducer,0);

				if(status === 0){
					if(taskData["completedAt"] === null || taskData["completedAt"] === undefined){
						status = 0;
					}
					else{
						status = 1;
					}
				}
				else{
					status = 2;
				}

				lGroupData.push({
					status: status,
					taskName: taskData["task"],
					id: taskData["id"]
				});
			}
		});

		return lGroupData;
	}

	updatePayload(e,data){

		const id = e.target.className;
		const idRgx = /curStatus_(.+)/;
		const val = id.match(idRgx);
		const taskID = val[1];
		const isIncomplete = /^incomplete/.test(id);
		const isLocked = /^locked/.test(id);
		const curPayload = JSON.parse(sessionStorage.getItem("ws_payload"));

		let taskInfo = this.getCurTaskInfo(taskID,curPayload);

		if(!isLocked){
			if(isIncomplete){
				taskInfo["completedAt"] = Date.now() || Date().getTime();
			}
			else{
				taskInfo["completedAt"] = null;
			}
		}

		const newPayLoad = curPayload.map((td) => {
			if(taskID == td["id"]){
				td = taskInfo;
			}
			return td;
		});

		sessionStorage.setItem('ws_payload', JSON.stringify(newPayLoad));
		sessionStorage.getItem("ws_payload");

		this.setState({updateComponent: true});
	}

	getCurTaskInfo(taskID,curPayload){
		for(const taskInfo of curPayload.values()){
			if(taskID == taskInfo["id"]){
				return taskInfo;
			}
		}
	}

	render() {
		const groupInfo = this.getGroupInfo();
		return (
			<div>
			{groupInfo.map( (taskInfo, index) => {
				const status = taskInfo["status"];
				const id = taskInfo["id"];
				return(
					<div key={"task_" + index} onClick={this.updatePayload} className={"curStatus_" + id}>
						<div key={"taskName_" + index} className = {this.state.statusNames[status] + " curStatus_" + id}>
							{taskInfo["taskName"]}
						</div>
					</div>
				);
			})}
			</div>
		);
	}
}

export default TaskGroup;