import React, { Component } from 'react';

export default class ExpenseIcon extends Component {
  iconFrom(category) {
    switch (category) {
      case "Utilities":
        return "local_grocery_store";
      case "Food":
        return "local_dining";
      case "Transport":
        return "directions_car";
      case "Hobbies":
        return "local_library";
      case "Remittance":
        return "home";
      case "Clothing":
        return "local_mall";
      case "Health":
        return "local_hospital";
      case "Entertainment","Leisure":
        return "local_movies";
      default:
        return "attach_money";
    }
  }

  render() {
    return (
      <span
        className={`mdc-list-item__start-detail ${this.props.category}`}
        role="presentation"
      >
        <i className="material-icons" aria-hidden="true">
          {this.iconFrom(this.props.category)}
        </i>
      </span>
    );
  }
}
