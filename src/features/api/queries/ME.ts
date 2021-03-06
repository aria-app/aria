import { gql } from '@apollo/client';

import { User } from '../../../types';

export type MeResponse = User;

export const ME = gql`
  query Me {
    me {
      email
      firstName
      id
      lastName
      role
    }
  }
`;
