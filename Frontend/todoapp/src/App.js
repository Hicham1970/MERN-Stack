import './App.css';
import { Component } from 'react';

class App extends Component {
  // Define base URL for API
  API_URL = "http://localhost:5000/";

  // Initialize state
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      name: "",
      email: "",
      message: ""
    };
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }


  // Fetch contacts using async/await
  async refreshContacts() {
    try {
      const response = await fetch(this.API_URL + "api/Contacts/GetContacts");
      const data = await response.json();
      this.setState({ contacts: data });
    } catch (err) {
      console.log(err);
    }
  }

  // Load contacts when component mounts
  componentDidMount() {
    this.refreshContacts();
  }

  // Add contact to the database
  handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, message } = this.state;
    console.log('Data being sent:', { name, email, message });

    try {
      const response = await fetch(`${this.API_URL}api/Contacts/AddContacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message
        })
      });

      const result = await response.json();
      console.log('Server response:', result);

      if (response.ok) {
        this.setState({
          name: '',
          email: '',
          message: ''
        });
        this.refreshContacts();
      }
    } catch (err) {
      console.log("Server error:", err);
    }
  }

  // Delete contact from the database
  handleDelete = async (id) => {
    try {
      const response = await fetch(`${this.API_URL}api/Contacts/DeleteContacts/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.refreshContacts();
      }
    } catch (err) {
      console.log("Error deleting contact:", err);
    }
  }


  render() {
    const { contacts, name, email, message } = this.state;
    return (
      <div className="App">
        <h2>Todo App</h2>
        {/* Add contact form */}
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            name='name'
            value={name}
            placeholder="Name"
            onChange={this.handleInputChange}


          />
          <input
            type="email"
            name='email'
            placeholder="Email"
            value={email}
            onChange={this.handleInputChange}

          />
          <input
            type="text"
            name='message'
            placeholder="Message"
            value={message}
            onChange={this.handleInputChange}

          />
          <button type="submit">Add Contact</button>
        </form>
        {/* Display contacts */}
        {contacts && contacts.length > 0 ? (
          contacts.map((contact) => (
            <div key={contact._id} className="contact-card">
              <h3>{contact.name}</h3>
              <p>{contact.email}</p>
              <p>{contact.message}</p>
              <button onClick={() => this.handleDelete(contact._id)}>Delete</button>
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
