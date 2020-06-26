import React, { Component } from "react";

//server configuration
import { ServerAddr } from "../netConfig";

//Victory Library imports
import {
  VictoryChart,
  VictoryBar,
  Bar,
  VictoryAxis,
  VictoryTheme,
  VictoryPie,
  VictoryLegend,
} from "victory";

//Bootstrap imports
import {
  Row,
  Col,
  Container,
  ListGroup,
  Nav,
  Tabs,
  Tab,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";

import "./Main.css";

class Main extends Component {
  state = {
    users: [],
    selectedUsers: [],
    userCount: [],
    averageContribution: [],
    overallContribution: [],
    mostCount: {},
  };

  componentDidMount() {
    this.getParticipants();
    this.getMostLeastContribution();
  }

  getParticipants = () => {
    //get request to fetch all users
    ServerAddr.get("participants").then((res) => {
      console.log("data", res);
      if ((res["status"] = 200)) {
        var data = res["data"]["data"];
        this.setState({ users: data });
      } else {
      }
    });
  };

  getUserCount = () => {
    // post request to fetch the user and the times spoken during the call
    ServerAddr.post("user/count", {
      users: this.state.selectedUsers,
    }).then((res) => {
      if (res) {
        var data = res["data"]["data"];
        this.setState({ userCount: data });
      } else {
        alert(res.data.validation);
      }
    });
  };

  getAverageContribution() {
    ServerAddr.post("user/average/contribution", {
      users: this.state.selectedUsers,
    }).then((res) => {
      if (res) {
        console.log("average", res);
        var data = res["data"]["data"];
        this.setState({ averageContribution: data });
      } else {
        alert(res.data.validation);
      }
    });
  }

  getMostLeastContribution() {
    ServerAddr.get("user/most&least/contribution").then((res) => {
      if (res) {
        console.log("most/least", res);
        var data = res["data"]["data"];
        this.setState({ overallContribution: data["contribution"] });
        this.setState({ mostCount: data["most_and_least"] });
        console.log("state", this.state.mostCount);
      } else {
        alert(res.data.validation);
      }
    });
  }

  handleChange = (event, data) => {
    //maintain an array of user ids selected
    let allUsers = this.state["selectedUsers"];
    let index = allUsers.findIndex((userData) => userData["id"] === data["id"]);
    if (index === -1) allUsers.push(data);
    else allUsers.splice(index, 1);
    this.setState({ selectedUsers: allUsers });
    this.getUserCount();
    this.getAverageContribution();
  };

  render() {
    const {
      users,
      userCount,
      averageContribution,
      overallContribution,
      mostCount,
    } = this.state;

    return (
      <div>
        <div className="header">
          <h1>COMBINE AI MEETING ANALYSIS</h1>
        </div>
        <div className="body" style={{ padding: "1%" }}>
          <Card style={{ width: "100%" }}>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <div className="card">
                    <div className="participants-wrapper">
                      <Row>
                        <Col md={8}>
                          <p>PARTICIPANTS </p>
                        </Col>
                        <Col md={4}>
                          <p className="show-hide">SHOW/HIDE</p>
                        </Col>
                      </Row>
                    </div>

                    <ListGroup className="custom-list">
                      {users.map((user, i) => {
                        return (
                          <ListGroup.Item key={i}>
                            <Row>
                              <Col md={10}>
                                <p style={{ marginLeft: "-60px" }}>
                                  {user.name}
                                </p>
                              </Col>
                              <Col md={2}>
                                <input
                                  type="checkbox"
                                  ref="complete"
                                  onChange={(e) => this.handleChange(e, user)}
                                />
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                </Col>

                <Col md={9}>
                  <div className="card">
                    <Tabs
                      style={{ margin: "0px" }}
                      transition={false}
                      defaultActiveKey="1"
                      id="uncontrolled-tab-example"
                    >
                      <Tab eventKey="1" title="Number of Times spoken">
                        <p className="tab-header">
                          Number of times partipant speaks
                        </p>

                        <div className="times-spoken card ">
                          <VictoryChart
                            theme={VictoryTheme.material}
                            height={300}
                            width={300}
                            domainPadding={{ x: 50, y: [0, 20] }}
                            scale={{ x: "time" }}
                          >
                            <VictoryLegend
                              x={120}
                              y={5}
                              centerTitle
                              orientation="horizontal"
                              gutter={5}
                              style={{
                                border: { stroke: "black" },
                                title: { fontSize: 5 },
                              }}
                              data={[
                                {
                                  name: "Y - Count",
                                  symbol: { fill: "tomato" },
                                },
                                {
                                  name: "X - Users",
                                  symbol: { fill: "orange", type: "star" },
                                },
                              ]}
                            />
                            <VictoryBar
                              dataComponent={<Bar />}
                              style={this.state.style}
                              data={userCount}
                              x="user__name"
                              y="dcount"
                            />
                          </VictoryChart>
                        </div>
                      </Tab>
                      <Tab eventKey="2" title="Overall Contribution">
                        <p className="tab-header">Overall Contribution</p>
                        {/* <p>
                          User who contributed the most{" "}
                          {mostCount["most"]["name"] -
                            mostCount["most"]["diff"]}
                        </p>
                        <p>
                          User who contributed the least{" "}
                          {mostCount["least"]["name"] -
                            mostCount["least"]["diff"]}{" "}
                        </p> */}

                        <div className="times-spoken card ">
                          <VictoryPie
                            data={overallContribution}
                            colorScale={[
                              "#F4511E",
                              "#FFF59D",
                              "#8BC34A",
                              "#006064",
                            ]}
                            x="name"
                            y="percentage_contribution"
                          />
                        </div>
                      </Tab>

                      <Tab eventKey="3" title="Average Contribution/User">
                        <p className="tab-header"> Average Contribution/User</p>
                        <div className="times-spoken card ">
                          <VictoryChart
                            theme={VictoryTheme.material}
                            height={300}
                            width={300}
                            domainPadding={{ x: 50, y: [0, 20] }}
                            scale={{ x: "time" }}
                          >
                            <VictoryLegend
                              x={100}
                              y={5}
                              centerTitle
                              orientation="horizontal"
                              gutter={5}
                              style={{
                                border: { stroke: "black" },
                                title: { fontSize: 5 },
                              }}
                              data={[
                                {
                                  name: "Y - Seconds",
                                  symbol: { fill: "tomato" },
                                },
                                {
                                  name: "X - Users",
                                  symbol: { fill: "orange", type: "star" },
                                },
                              ]}
                            />
                            <VictoryBar
                              dataComponent={<Bar />}
                              style={this.state.style}
                              data={averageContribution}
                              x="name"
                              y="avg"
                            />
                          </VictoryChart>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </div>
    );
  }
}

export default Main;
