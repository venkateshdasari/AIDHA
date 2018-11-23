import React, {Component} from "react";
import {ExpenseList, ExpenseForm, LoadingBar, SignUp} from "./components/index";
import {MDCSnackbar} from "@material/snackbar/dist/mdc.snackbar.js";
import {getConfig, getAllExpense, addExpense} from "./utils/fetchAPI";

import "@material/fab/dist/mdc.fab.css";
import "@material/button/dist/mdc.button.css";
import "@material/toolbar/dist/mdc.toolbar.css";
import "@material/snackbar/dist/mdc.snackbar.css";
import "@material/card/dist/mdc.card.css";

import "./App.css";

const userID = "mkusnadi";

class App extends Component {
  constructor() {
    super();

    this.state = {
      signedIn: true,
      accounts: [],
      categories: [],
      expenses: [],
      expenses_temp: [],
      processing: true,
      expense: {},
      currentMonth: 0,
      currentMonthGoal: 400,
      showExpenseForm: false
    };

  }

  componentDidMount() {
    this.load();
  }

  signedInChanged = (signedIn) => {
    console.log(signedIn);
    this.setState({signedIn: signedIn});
    if (this.state.signedIn) {
      this.load();
    }
  }

  handleExpenseSubmit = () => {
    this.setState({processing: true, showExpenseForm: false});
    const submitAction = (this.state.expense.id
      ? this.update
      : this.append).bind(this);
    submitAction(this.state.expense);
  }

  handleExpenseChange = (attribute, value) => {
    this.setState({
      expense: Object.assign({}, this.state.expense, {[attribute]: value})
    });
  }

  handleExpenseDelete = (expense) => {
    this.setState({processing: true, showExpenseForm: false});
    const expenseRow = expense.id.substring(10);
    window.gapi.client.sheets.spreadsheets
      .batchUpdate({
        spreadsheetId: this.spreadsheetId,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0,
                  dimension: "ROWS",
                  startIndex: expenseRow - 1,
                  endIndex: expenseRow
                }
              }
            }
          ]
        }
      })
      .then(
        response => {
          this.snackbar.show({message: "Expense deleted!"});
          this.load();
        },
        response => {
          console.error("Something went wrong");
          console.error(response);
          this.setState({loading: false});
        }
      );
  }

  handleExpenseSelect = (expense) => {
    this.setState({expense: expense, showExpenseForm: true});
  }

  handleExpenseCancel = () => {
    this.setState({showExpenseForm: false});
  }


  onExpenseNew() {
    const now = new Date();
    this.setState({
      showExpenseForm: true,
      expense: {
        amount: "",
        description: "",
        date: `${now.getFullYear()}-${now.getMonth() < 9
          ? "0" + (now.getMonth() + 1)
          : now.getMonth() + 1}-${now.getDate() < 10
          ? "0" + now.getDate()
          : now.getDate()}`,
        category: this.state.categories[0],
        account: this.state.accounts[0]
      }
    });
  }



    parseExpense(value, index) {


        this.setState({
            currentMonth: parseInt(value.amount) + this.state.currentMonth
        })
        console.log(this.state.currentMonth);
        return {
            id: `Expenses!A${index + 2}`,
            date: value.date,
            description: value.description,
            category: value.category,
            amount: value.amount,
            account: value.spending_type,
            userID:value.user_id,
            
        };
    }




  append(expense) {
    console.log(expense);
    addExpense(userID, expense.description, expense.date, expense.category, expense.account, expense.amount, () => {
      console.log("expense ADDED");
      let lst = this.state.expenses_temp;
      lst.push(this.parseExpense(expense, this.state.expenses_temp.length));
      this.setState({
        expenses_temp: lst,
        expenses: lst.reverse()
          .slice(0, 30),
        processing: false,
      })
    }, () => {
      console.log("expense cant be added");
      this.setState({
        processing: false
      })
    })
  }

  update(expense) {
    return window.gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: expense.id,
      valueInputOption: "USER_ENTERED",
      values: [this.formatExpense(expense)]
    });
  }

  load() {
    getConfig((response) => {
      console.log(response);
      this.setState({
        accounts: response.spending_type,
        categories: response.category.monthly
      })
    }, () => {
      console.log("Error fetching configs");
    });

    getAllExpense("mkusnadi", (data) => {
      console.log(data)
        let tmp = (data || []).map(this.parseExpense.bind(this));
      this.setState({
        expenses: tmp
          .reverse()
          .slice(0, 30),
        expenses_temp: tmp,
        processing: false,
      });
    }, () => {
      console.log("Error fetching expenses");
    })

  }


  render() {
    return (
      <div>
        <header className="mdc-toolbar mdc-toolbar--fixed">
          <div className="mdc-toolbar__row">
            <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
              <span className="mdc-toolbar__title"><b>aidha</b> - Expense Manager</span>
            </section>
            <section
              className="mdc-toolbar__section mdc-toolbar__section--align-end"
              role="toolbar"
            >
              {this.state.signedIn === false &&
              <a
                className="material-icons mdc-toolbar__icon"
                aria-label="Sign in"
                alt="Sign in"
                onClick={e => {
                  e.preventDefault();
                  window.gapi.auth2.getAuthInstance().signIn();
                }}
              >
                perm_identity
              </a>}
              {this.state.signedIn &&
              <a
                className="material-icons mdc-toolbar__icon"
                aria-label="Sign out"
                alt="Sign out"
                onClick={e => {
                  e.preventDefault();
                  window.gapi.auth2.getAuthInstance().signOut();
                }}
              >
                exit_to_app
              </a>}
            </section>
          </div>
        </header>
        <div className="toolbar-adjusted-content">
          {this.state.signedIn === undefined && <LoadingBar/>}
          {this.state.signedIn === false &&
          <div className="center">
            <button
              className="mdc-button sign-in"
              aria-label="Sign in"
              onClick={() => {
                window.gapi.auth2.getAuthInstance().signIn();
              }}
            >
              Sign In
            </button>
          </div>}
          {this.state.signedIn && this.renderBody()}
        </div>
        <div
          ref={el => {
            if (el) {
              this.snackbar = new MDCSnackbar(el);
            }
          }}
          className="mdc-snackbar"
          aria-live="assertive"
          aria-atomic="true"
          aria-hidden="true"
        >
          <div className="mdc-snackbar__text"/>
          <div className="mdc-snackbar__action-wrapper">
            <button
              type="button"
              className="mdc-button mdc-snackbar__action-button"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    );
  }


  renderBody() {
    if (this.state.processing) return <LoadingBar/>;
    else
      return (
        <div className="content">
          {this.renderExpenses()}
        </div>
      );
  }

  renderExpenses() {
    if (this.state.showExpenseForm)
      return (
        <ExpenseForm
          categories={this.state.categories}
          accounts={this.state.accounts}
          expense={this.state.expense}
          onSubmit={this.handleExpenseSubmit}
          onCancel={this.handleExpenseCancel}
         // onDelete={this.handleExpenseDelete}
          onChange={this.handleExpenseChange}
        />
      );
    else
      return (
        <div>
          <div className="mdc-card">
            <section className="mdc-card__primary">
              <h2 className="mdc-card__subtitle">This month you've spent $:</h2>
              <h1 className="mdc-card__title mdc-card__title--large center">
                {this.state.currentMonth}
              </h1>
            </section>
            <section className="mdc-card__supporting-text">
              Current month Goal: {this.state.currentMonthGoal}
            </section>
          </div>
          <ExpenseList
            expenses={this.state.expenses}
            onSelect={this.handleExpenseSelect}
          />
          <button
            onClick={() => this.onExpenseNew()}
            className="mdc-fab app-fab--absolute material-icons"
            aria-label="Add expense"
          >
            <span className="mdc-fab__icon">add</span>
          </button>
        </div>
      );
  }
}

export default App;
