import './App.css';
import { Component } from 'react';

class App extends Component {
  // Define base URL for API
  API_URL = "http://localhost:5000/";

  // Initialize state
  constructor(props) {
    super(props);
    this.state = {
      contacts: []
    };
  }

  // Fetch contacts using async/await
  async refreshContacts() {
    try {
      const response = await fetch(`${this.API_URL}api/Contacts/GetContacts`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log("Fetched data:", data);
      this.setState({ contacts: data });
    } catch (err) {
      console.log("Error fetching contacts:", err);
    }
  }

  // Load contacts when component mounts
  componentDidMount() {
    this.refreshContacts();
  }

  render() {
    const { contacts } = this.state;
    return (
      <div className="App">
        <h2>Todo App</h2>
        {/* Add contact form */}
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <input
            type="text"
            placeholder="Message"
            value={this.state.message}
            onChange={this.handleChange}
          />&nbsp;&nbsp;
          <button type="submit">Add Contact</button>
        </form>
        {/* Display contacts */}
        {contacts && contacts.length > 0 ? (
          contacts.map(contact => (
            <div key={contact.id} className="contact-card">
              <h3>{contact.name}</h3>
              <p>{contact.email}</p>
              <p>{contact.message}</p>
              <button onClick={() => this.deleteContact(contact.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>Loading contacts...</p>
        )}
      </div>
    );
  }
}

export default App;
