import { gql } from "@apollo/client";


export const GET_CAR_MAKE_BY_ID = gql`
  query ($id: Int!) {
    carMakeById (id: $id) {
      id
      name
    }
  }`;

export const CREATE_OR_GET_CAR_MAKE = gql`
  mutation ($name: String!) {
    createOrGetCarMake(carMakeInput: {name:  $name}) {
      id
      name
    }
  }`;

export const GET_CAR_MODEL_BY_ID = gql`
  query ($id: Int!) {
    carModelById (id: $id) {
      id
      name
      carMakeId
    }
  }`;

export const CREATE_OR_GET_CAR_MODEL = gql`
  mutation ($carMakeId: Int!, $name: String!) {
  createOrGetCarModel(carModelInput: {carMakeId: $carMakeId, name: $name}) {
      id,
      name,
    }
  }`;

export const GET_MEMBERS = gql`
  query ($first: Int!) {
    members(first: $first) {
      nodes {
        id
        firstName
        lastName
        email
        vin
        mfd
        carModelId
      }
    }
  }`;

export const GET_MEMBERS_BY_AGE = gql`
  query ($first: Int!) {
    members(first: $first) {
      nodes {
        id
        firstName
        lastName
        email
        vin
        mfd
        carModelId
      }
    }
  }`;

export const GET_MEMBER_BY_NAME = gql`
  query ($firstName: String!, $lastName: String!, $vin: String!) {
    memberByName(
      firstName: $firstName, 
      lastName: $lastName, 
      vin: $vin) {
        id
        firstName
        lastName
        email
        vin
        mfd
      }
  }`;

export const CREATE_MEMBER = gql`
  mutation (
    $firstName: String!, 
    $lastName: String!, 
    $email: String!, 
    $vin: String!, 
    $mfd: Datetime!, 
    $carModelId: Int!
  ) {
    createMember(memberInput:  {
      firstName: $firstName, 
      lastName: $lastName, 
      email: $email, 
      vin: $vin, 
      mfd: $mfd, 
      carModelId: $carModelId
    }) {
      id
      firstName
      lastName
      email
      vin
      mfd
    }
  }
`;

export const CREATE_CAR_MAKE = gql`
  mutation ($name: String!) {
    createCarMake(carMakeInput: {name:  $name}) {
      id
      name
    }
  }
`;

export const CREATE_CAR_MODEL = gql`
  mutation ($carMakeId: Int!, $name: String!) {
    createCarModel(carModelInput: {carMakeId: $carMakeId, name: $name}) {
      id,
      name,
    }
  }
`;