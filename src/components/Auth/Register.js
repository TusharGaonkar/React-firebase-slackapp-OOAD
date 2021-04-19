import React, { Component } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import md5 from 'md5';
class Register extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    errors: [],
    loading: false,
    usersRef : firebase.database().ref("users")
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.target.reset();
 

    if (this.isFormValid()) {
        
      this.setState({ errors: [], loading: true });
      event.preventDefault();
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password)
        .then((createdUser) => {
          console.log(createdUser);
          createdUser.user.updateProfile(
              {
                  displayName : createdUser.user.username,
                  pictureURL : `http://gavatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
              }
          )
          .then(()=> {
              this.saveUser(createdUser).then(()=> {
                  console.log('user saved');
                  this.setState( {loading : false});
          });
          })
          .catch(err => {
              console.error(err);
              this.setState({errors : this.state.errors.concat(err) , loading : false})
          })
        })
         .catch(err => { 
            this.setState({ })
          console.error(err);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(err),
          });
        });
    }
}

saveUser = createdUser => {

    return this.state.usersRef.child(createdUser.user.uid).set({
        name : createdUser.user.displayName,
        avatar : createdUser.user.photoURL
    })

}

  isFormValid = () => {
    let errors = [];
    let error;
    if (this.isFormEmpty(this.state)) {
      error = { message: " Fill all the details" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
      error = { message: " Password is invalid" };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else {
      return true;
    }
  };

  isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
    return (
      !username.length ||
      !email.length ||
      !password.length ||
      !passwordConfirmation.length
    );
  };

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  };

  displayErros = (errors) =>
    errors.map((error, index) => <p key={index}>{error.message}</p>);

 handleInputError = (errors , inputType) =>{
       return  errors.some(error => error.message.toLowerCase().includes(inputType))
        ? 'error' : ''
    }




  render() {
    const {
      username,
      email,
      password,
      passwordConfirmation,
      errors,
      loading,
    } = this.state;

    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for Chat
          </Header>
          <Form size="large" onSubmit={this.handleSubmit}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={this.handleChange}
                className = {this.handleInputError(errors , username)}
                type="text"
              
              />
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email Address"
                className = {this.handleInputError(errors , email)}

                onChange={this.handleChange}
                type="text"
               
              />
              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                className = {this.handleInputError(errors , password)}

                type="password"
              
              />
              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password"
                onChange={this.handleChange}
                className = {this.handleInputError(errors , passwordConfirmation)}
                type="password"
               
              />
              <Button
                disabled={loading}
                className={loading ? "loading" : ""}
                color="orange"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {this.state.errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErros(errors)}
            </Message>
          )}
          <Message>
            Already an User? <Link to="/login">Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Register;
