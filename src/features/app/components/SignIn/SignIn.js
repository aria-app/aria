import * as firebase from "firebase/app";
import getOr from "lodash/fp/getOr";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import React from "react";
import { Translation } from "react-i18next";
import { Redirect } from "react-router-dom";
import styled from "styled-components/macro";
import shared from "../../../shared";

const { authProvider } = shared.constants;

const StyledSignIn = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
`;

export class SignIn extends React.Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired
  };

  componentDidMount() {
    window.document.title = "Sign In - Zen Sequencer";
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to={this.getRedirectFrom()} />;
    }

    return (
      <Translation>
        {t => (
          <StyledSignIn>
            <Button
              onClick={() => firebase.auth().signInWithRedirect(authProvider)}
            >
              {t("Sign in with Google")}
            </Button>
          </StyledSignIn>
        )}
      </Translation>
    );
  }

  getRedirectFrom = () =>
    getOr({ pathname: "/" }, "props.location.state.from", this);
}
