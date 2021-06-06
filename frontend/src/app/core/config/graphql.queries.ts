import { gql } from "@apollo/client";

export const LIST_MEMBERS = gql`
  query ($first: Int!, $offset: Int!, $query: String, $orderBy: MembersOrderBy!) {
    members(first: $first, offset: $offset, query: $query, orderBy: $orderBy) {
      totalCount
      nodes {
        id
        firstName
        lastName
        email
        vin
        mfd
        carModel {
          id
          name
          carMake {
            id
            name
          }
        }
      }
    }
  }
`;

export const CREATE_MEMBER = gql`
  mutation (
    $firstName: String!, 
    $lastName: String!, 
    $email: String!, 
    $vin: String!, 
    $mfd: Datetime!, 
    $carModelId: Int!
  ) {
    createMember(memberInput: {
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

export const UPDATE_MEMBER = gql`
  mutation (
    $id: Int!,
    $firstName: String!, 
    $lastName: String!, 
    $email: String!, 
    $vin: String!, 
    $mfd: Datetime!, 
    $carModelId: Int!
  ) {
    updateMember(memberInput: {
      id: $id,
      firstName: $firstName, 
      lastName: $lastName, 
      email: $email, 
      vin: $vin, 
      mfd: $mfd, 
      carModelId: $carModelId}
      ) {
      id
      firstName
      lastName
      email
      vin
      mfd
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation ($id: Int!) {
    deleteMember(id: $id) {
      deletedMemberId
    }
  }
`;


export const LIST_CAR_MODEL = gql`
  query {
    carModels {
      id,
      name,
      carMake {
        id,
        name
      }
    }
  }`;

export const CREATE_CAR_MODEL = gql`
  mutation ($carMakeId: Int!, $name: String!) {
    createCarModel(carModelInput: {carMakeId: $carMakeId, name: $name}) {
      id
      name
    }
  }`;

export const UPDATE_CAR_MODEL = gql`
  mutation ($id: Int!, $carMakeId: Int!, $name: String!) {
    updateCarModel(carModelInput: {id: $id, carMakeId: $carMakeId, name: $name}) {
      id
      name
    }
  }`;

export const DELETE_CAR_MODEL = gql`
  mutation ($id: Int!) {
    deleteCarModel(id: $id) {
      deletedCarModelId
    }
  }`;


export const LIST_CAR_MAKE = gql`
  query {
    carMakes {
      id
      name
    }
  }`;

export const CREATE_CAR_MAKE = gql`
  mutation ($name: String!) {
    createCarMake(carMakeInput: {name: $name}) {
      id
      name
    }
  }`;

export const UPDATE_CAR_MAKE = gql`
  mutation ($id: Int!, $name: String!) {
    updateCarMake(carMakeInput: {id: $id, name: $name}) {
      id, 
      name
    }
  }`;

export const DELETE_CAR_MAKE = gql`
  mutation ($id: Int!) {
    deleteCarMake(id: $id) {
      deletedCarMakeId
    }
  }`;

