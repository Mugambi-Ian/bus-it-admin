import React, { Component } from "react";
import Loader from "../../../assets/components/loader/loader";
import { _database } from "../../../config";
import "./manage.css";

export default class ManageUsers extends Component {
  state = {
    accounts: [],
    searchKey: "",
    editing: false,
    userInfo: false,
    loading: true,
    myTransactions: undefined,
    routeId: undefined,
  };
  async componentDidMount() {
    await _database.ref("routes").on("value", (x) => {
      const d = [];
      x.forEach((c) => {
        const _c = c.val();
        d.push(_c);
      });
      this.setState({ accounts: d, loading: false });
    });
  }
  render() {
    return (
      <div className="manage-body">
        {this.state.route ? (
          <RouteManger
            showTimedToast={this.props.showTimedToast}
            route={this.state.route}
            close={() => {
              this.setState({ route: undefined });
            }}
          />
        ) : (
          <>
            <h3 className="title unselectable">Routes</h3>
            <div className="search-bar" />
            {this.state.loading === true ? (
              <Loader />
            ) : (
              <div className="accounts-list">
                {this.state.accounts.map((x, i) => {
                  return (
                    <div className="account-card">
                      <img
                        alt=""
                        src={
                          require("../../../assets/drawables/destination.png")
                            .default
                        }
                        className="unselectable"
                      />
                      <p className="name unselectable">{x.routeName}</p>
                      <div className="card-options">
                        <p
                          className="unselectable"
                          onClick={async () => {
                            await setTimeout(() => {
                              this.setState({ route: x });
                            }, 100);
                          }}
                        >
                          Open Schedule
                        </p>
                      </div>
                      <div className="card-options">
                        <p
                          className="unselectable"
                          onClick={async () => {
                            await setTimeout(() => {
                              this.setState({ editing: x });
                            }, 100);
                          }}
                        >
                          Route Info
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        {this.state.editing ? (
          <EditRoute
            editing={this.state.editing}
            close={() => {
              this.setState({ editing: undefined });
            }}
            showTimedToast={this.props.showTimedToast}
          />
        ) : this.state.route ? (
          ""
        ) : (
          <p
            className="create-route-btn unselectable"
            onClick={async () => {
              await setTimeout(() => {
                this.setState({ editing: { routeId: undefined } });
              }, 100);
            }}
          >
            Add Route
          </p>
        )}
      </div>
    );
  }
}

class EditRoute extends Component {
  state = {
    loading: true,
    route: {
      routeId: "",
      routeName: "",
      createdOn: "",
    },
    exit: false,
    registered: false,
  };
  async componentDidMount() {
    var x = this.props.editing;
    if (x === undefined || x.routeId === undefined) {
      x = {
        routeId: "",
        routeName: "",
        createdOn: "",
        routeBalance: "",
      };
      const k = await _database.ref("routes").push();
      x.routeId = k.key;
      const _d = new Date();
      const d =
        _d.getDate() + "-" + (_d.getMonth() + 1) + "-" + _d.getFullYear();
      x.createdOn = d;
    } else {
      this.setState({ registered: true });
    }
    await _database.ref("routes/" + x.routeId).on("value", (data) => {
      if (data.val()) {
        const { routeId, routeName, createdOn } = data.val();
        const p = {
          routeId: routeId,
          routeName: routeName,
          createdOn: createdOn,
        };
        this.setState({ route: p });
      } else {
        const p = {
          routeId: x.routeId,
          routeName: "",
          routestatus: true,
          address: "",
          createdOn: x.createdOn,
          routeBalance: 0,
        };
        this.setState({ route: p });
      }
      this.setState({
        loading: false,
      });
    });
  }
  render() {
    return (
      <div className="pop-up-body">
        <div
          className={
            this.state.exit === false
              ? "edit-route-body start"
              : "edit-route-body exit"
          }
        >
          {this.state.loading === true ? (
            <Loader />
          ) : (
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                minHeight: "100%",
                animation: "fade-in ease-in 0.3s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: "1",
                  minHeight: "80%",
                }}
              >
                <h3 className="route-title unselectable">
                  {this.state.route.routeName
                    ? this.state.route.routeName
                    : "New route"}
                </h3>
                <div className="field">
                  <img
                    alt=""
                    draggable={false}
                    src={
                      require("../../../assets/drawables/calendar.png").default
                    }
                    className="unselectable"
                  />
                  <p className="field-title">Registration date</p>
                  <input disabled={true} value={this.state.route.createdOn} />
                </div>
                <div className="field">
                  <img
                    alt=""
                    draggable={false}
                    src={require("../../../assets/drawables/id.png").default}
                    className="unselectable"
                  />
                  <p className="field-title">Route Id</p>
                  <input value={this.state.route.routeId} disabled={true} />
                </div>
                <div className="field">
                  <img
                    alt=""
                    draggable={false}
                    src={
                      require("../../../assets/drawables/address.png").default
                    }
                    className="unselectable"
                  />
                  <p className="field-title">Route Name</p>
                  <input
                    value={this.state.route.routeName}
                    onChange={(_) => {
                      const x = this.state.route;
                      x.routeName = _.target.value;
                      this.setState({ route: x });
                    }}
                    placeholder="RouteName"
                    name="routeName"
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignSelf: "center",
                  marginBottom: "10px",
                }}
              >
                <p
                  className="btn unselectable"
                  onClick={async () => {
                    var { routeId, routeName, createdOn } = this.state.route;
                    const p = {
                      routeId: routeId,
                      routeName: routeName,
                      createdOn: createdOn,
                    };
                    await _database
                      .ref("routes/" + p.routeId)
                      .set(p)
                      .then((c) => {
                        this.props.showTimedToast("Save Succeffull");
                        this.props.close();
                      });
                  }}
                >
                  Save
                </p>
                <p
                  className="btn unselectable"
                  onClick={async () => {
                    await setTimeout(() => {
                      this.setState({ exit: true });
                      this.props.close();
                    }, 100);
                  }}
                >
                  Close
                </p>
                <div style={{ marginTop: "10px" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

class RouteManger extends Component {
  state = { loading: true };
  componentDidMount() {
    const r = this.props.route;
    this.db = _database.ref("routes/" + r.routeId + "/trips");
    this.db.on("value", (x) => {
      const t = [];
      x.forEach((dd) => {
        t.push(dd.val());
      });
      this.setState({ schedule: t, loading: false });
    });
  }
  render() {
    return (
      <div className="manage-body">
        <h3 className="title unselectable">{this.props.route.routeName}</h3>
        <div className="search-bar" />
        {this.state.loading === true ? (
          <Loader />
        ) : (
          <div className="accounts-list">
            {this.state.schedule.map((x, i) => {
              return (
                <div className="account-card">
                  <img
                    alt=""
                    src={require("../../../assets/drawables/logo.png").default}
                    className="unselectable"
                  />
                  <p className="name unselectable">
                    Vechile Capacity: {x.capacity}
                  </p>
                  <p className="title-2 unselectable">
                    Depature Time: {x.depature}
                  </p>
                  <p className="title-2 unselectable">
                    Expected Arrival: {x.arrival}
                  </p>
                  <p className="title-2 unselectable">
                    Ticket Price: {x.price}
                  </p>
                  <Days days={x.avialableOn} />
                  <div className="card-options">
                    <p
                      className="unselectable"
                      onClick={async () => {
                        await setTimeout(() => {
                          this.setState({
                            trip: { ...x, routeId: this.props.route.routeId },
                          });
                        }, 100);
                      }}
                    >
                      Edit Trip Info
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {this.state.trip ? (
          <EditTrip
            showTimedToast={this.props.showTimedToast}
            trip={this.state.trip}
            close={() => {
              this.setState({ trip: undefined });
            }}
          />
        ) : (
          <>
            <p
              className="create-route-btn unselectable"
              onClick={async () => {
                await setTimeout(() => {
                  this.setState({
                    trip: {
                      tripId: undefined,
                      routeId: this.props.route.routeId,
                    },
                  });
                }, 100);
              }}
            >
              Add Trip
            </p>
            <p
              className="create-route-btn unselectable"
              style={{ top: "20px", height: "min-content" }}
              onClick={async () => {
                await setTimeout(() => {
                  this.props.close();
                }, 100);
              }}
            >
              Close
            </p>
          </>
        )}
      </div>
    );
  }
}

class EditTrip extends Component {
  state = {
    loading: true,
    trip: {
      tripId: "",
      routeId: "",
      createdOn: "",
      avialableOn: "",
      depature: "",
      arrival: "",
      capacity: 0,
      price: 0,
    },
    exit: false,
    registered: false,
  };
  async componentDidMount() {
    var x = this.props.trip;
    if (x === undefined || x.tripId === undefined) {
      x = {
        tripId: "",
        createdOn: "",
        avialableOn: "",
        depature: "",
        arrival: "",
        capacity: 0,
        price: 0,
        routeId: x.routeId,
      };
      const k = await _database.ref("routes/" + x.routeId + "/trips").push();
      x.tripId = k.key;
      const _d = new Date();
      const d =
        _d.getDate() + "-" + (_d.getMonth() + 1) + "-" + _d.getFullYear();
      x.createdOn = d;
      this.setState({ trip: x });
    } else {
      this.setState({ registered: true, trip: x });
    }
    await _database
      .ref("routes/" + x.routeId + "/trips" + x.tripId)
      .on("value", (data) => {
        this.setState({ loading: false });
      });
  }
  render() {
    return (
      <div className="pop-up-body">
        <div
          className={
            this.state.exit === false
              ? "edit-route-body start"
              : "edit-route-body exit"
          }
        >
          {this.state.loading === true ? (
            <Loader />
          ) : (
            <div
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "column",
                minHeight: "100%",
                animation: "fade-in ease-in 0.3s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: "1",
                  minHeight: "80%",
                }}
              >
                <h3 className="route-title unselectable">Trip Info</h3>
                <div className="field">
                  <img
                    alt=""
                    draggable={false}
                    src={
                      require("../../../assets/drawables/calendar.png").default
                    }
                    className="unselectable"
                  />
                  <p className="field-title">Registration date</p>
                  <input disabled={true} value={this.state.trip.createdOn} />
                </div>
                <div className="field">
                  <img
                    alt=""
                    draggable={false}
                    src={require("../../../assets/drawables/id.png").default}
                    className="unselectable"
                  />
                  <p className="field-title">Trip Id</p>
                  <input value={this.state.trip.tripId} disabled={true} />
                </div>
                <div className="field">
                  <img
                    alt=""
                    draggable={false}
                    src={
                      require("../../../assets/drawables/icon-car.png").default
                    }
                    className="unselectable"
                  />
                  <p className="field-title">Vechile Capacity</p>
                  <input
                    value={this.state.trip.capacity}
                    onChange={(_) => {
                      const x = this.state.trip;
                      x.capacity = _.target.value;
                      this.setState({ trip: x });
                    }}
                    placeholder="Vechile Capacity"
                  />
                </div>
                <div className="field">
                  <img
                    alt=""
                    draggable={false}
                    src={
                      require("../../../assets/drawables/ticket.png").default
                    }
                    className="unselectable"
                  />
                  <p className="field-title">Ticket Price</p>
                  <input
                    value={this.state.trip.price}
                    onChange={(_) => {
                      const x = this.state.trip;
                      x.price = _.target.value;
                      this.setState({ trip: x });
                    }}
                    placeholder="Ticket Price"
                  />
                </div>
                <div className="field">
                  <img
                    alt=""
                    draggable={false}
                    src={
                      require("../../../assets/drawables/clock1.png").default
                    }
                    className="unselectable"
                  />
                  <p className="field-title">Depature Time</p>
                  <input
                    value={this.state.trip.depature}
                    onChange={(_) => {
                      const x = this.state.trip;
                      x.depature = _.target.value;
                      this.setState({ trip: x });
                    }}
                    placeholder="10:30 am"
                  />
                </div>
                <div className="field">
                  <img
                    alt=""
                    draggable={false}
                    src={
                      require("../../../assets/drawables/clock2.png").default
                    }
                    className="unselectable"
                  />
                  <p className="field-title">Expected Arrival Time</p>
                  <input
                    value={this.state.trip.arrival}
                    onChange={(_) => {
                      const x = this.state.trip;
                      x.arrival = _.target.value;
                      this.setState({ trip: x });
                    }}
                    placeholder="Arrival"
                  />
                </div>
                <div className="field" style={{ minHeight: "60px" }}>
                  <p className="field-title">Available On</p>
                  <Days
                    edit={true}
                    days={this.state.trip.avialableOn}
                    update={(x) => {
                      this.setState({
                        trip: { ...this.state.trip, avialableOn: x },
                      });
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignSelf: "center",
                  marginBottom: "10px",
                }}
              >
                <p
                  className="btn unselectable"
                  onClick={async () => {
                    const t = this.state.trip;
                    _database
                      .ref("routes/" + t.routeId + "/trips/" + t.tripId)
                      .set(t)
                      .then((x) => {
                        this.setState({ exit: true });
                        this.props.close();
                        this.props.showTimedToast("Save Successful");
                      });
                  }}
                >
                  Save
                </p>
                <p
                  className="btn unselectable"
                  onClick={async () => {
                    await setTimeout(() => {
                      this.setState({ exit: true });
                      this.props.close();
                    }, 100);
                  }}
                >
                  Close
                </p>
                <div style={{ marginTop: "10px" }} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

class Days extends Component {
  state = { ...this.props };

  render() {
    const d = this.state;
    return (
      <div className={d.edit ? "fd-days edit" : "fd-days"}>
        <p
          className={
            d.days.includes("1-") === true
              ? "day on unselectable"
              : "day unselectable"
          }
          onClick={() => {
            if (d.edit) {
              if (d.days.includes("1-") === true) {
                d.days = d.days.replace("1-", "");
              } else {
                d.days = d.days + "1-";
              }
              this.setState({ days: d.days });
              this.props.update(d.days);
            }
          }}
        >
          Sunday
        </p>
        <p
          className={
            d.days.includes("2-") === true
              ? "day on unselectable"
              : "day unselectable"
          }
          onClick={() => {
            if (d.edit) {
              if (d.days.includes("2-") === true) {
                d.days = d.days.replace("2-", "");
              } else {
                d.days = d.days + "2-";
              }
              this.setState({ days: d.days });
              this.props.update(d.days);
            }
          }}
        >
          Monday
        </p>
        <p
          className={
            d.days.includes("3-") === true
              ? "day on unselectable"
              : "day unselectable"
          }
          onClick={() => {
            if (d.edit) {
              if (d.days.includes("3-") === true) {
                d.days = d.days.replace("3-", "");
              } else {
                d.days = d.days + "3-";
              }
              this.setState({ days: d.days });
              this.props.update(d.days);
            }
          }}
        >
          Tuesday
        </p>
        <p
          className={
            d.days.includes("4-") === true
              ? "day on unselectable"
              : "day unselectable"
          }
          onClick={() => {
            if (d.edit) {
              if (d.days.includes("4-") === true) {
                d.days = d.days.replace("4-", "");
              } else {
                d.days = d.days + "4-";
              }
              this.setState({ days: d.days });
              this.props.update(d.days);
            }
          }}
        >
          Wenesday
        </p>
        <p
          className={
            d.days.includes("5-") === true
              ? "day on unselectable"
              : "day unselectable"
          }
          onClick={() => {
            if (d.edit) {
              if (d.days.includes("5-") === true) {
                d.days = d.days.replace("5-", "");
              } else {
                d.days = d.days + "5-";
              }
              this.setState({ days: d.days });
              this.props.update(d.days);
            }
          }}
        >
          Thursday
        </p>
        <p
          className={
            d.days.includes("6-") === true
              ? "day on unselectable"
              : "day unselectable"
          }
          onClick={() => {
            if (d.edit) {
              if (d.days.includes("6-") === true) {
                d.days = d.days.replace("6-", "");
              } else {
                d.days = d.days + "6-";
              }
              this.setState({ days: d.days });
              this.props.update(d.days);
            }
          }}
        >
          Friday
        </p>
        <p
          className={
            d.days.includes("7-") === true
              ? "day on unselectable"
              : "day unselectable"
          }
          onClick={() => {
            if (d.edit) {
              if (d.days.includes("7-") === true) {
                d.days = d.days.replace("7-", "");
              } else {
                d.days = d.days + "7-";
              }
              this.setState({ days: d.days });
              this.props.update(d.days);
            }
          }}
        >
          Saturday
        </p>
      </div>
    );
  }
}
