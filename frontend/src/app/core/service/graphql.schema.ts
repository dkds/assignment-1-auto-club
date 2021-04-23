import { gql } from "@apollo/client";

export const LIST_MEMBERS = gql`
  query ($first: Int!, $offset: Int!, $orderBy: MembersOrderBy!) {
    members(first: $first, offset: $offset, orderBy: [$orderBy]) {
      totalCount
      nodes {
        id
        firstName
        lastName
        email
        vin
        mfd
        carModel
        carMake
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
    createMember(input: {member: {
      firstName: $firstName, 
      lastName: $lastName, 
      email: $email, 
      vin: $vin, 
      manufacturedDate: $mfd, 
      carModelId: $carModelId
    }}) {
      member {
        id
        firstName
        lastName
        email
        vin
        manufacturedDate
        carModelId
      }
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
    updateMemberById(input: {id: $id, memberPatch: {
      firstName: $firstName, 
      lastName: $lastName, 
      email: $email, 
      vin: $vin, 
      manufacturedDate: $mfd, 
      carModelId: $carModelId}}) {
      member {
        id
        firstName
        lastName
        email
        vin
        manufacturedDate
        carModelId
      }
    }
  }
`;

export const DELETE_MEMBER = gql`
  mutation ($id: Int!) {
    deleteMemberById(input: {id: $id}) {
      deletedMemberId
    }
  }
`;


export const LIST_CAR_MODEL = gql`
  query {
    allCarModels {
      nodes {
        id,
        carMakeId,
        name
      }
    }
  }`;

export const CREATE_CAR_MODEL = gql`
  mutation ($carMakeId: Int!, $name: String!) {
    createCarModel(input: {carModel: {carMakeId: $carMakeId, name: $name}}) {
      carModel {
        id
        carMakeId
        name
      }
    }
  }`;

export const UPDATE_CAR_MODEL = gql`
  mutation ($id: Int!, $carMakeId: Int!, $name: String!) {
    updateCarModelById(input: {id: $id, carModelPatch: {carMakeId: $carMakeId, name: $name}}) {
      carModel {
        id
        carMakeId
        name
      }
    }
  }`;

export const DELETE_CAR_MODEL = gql`
  mutation ($id: Int!) {
    deleteCarModelById(input: {id: $id}) {
      deletedCarModelId
    }
  }`;


export const LIST_CAR_MAKE = gql`
  query {
    allCarMakes {
      nodes {
        id
        name
      }
    }
  }`;

export const CREATE_CAR_MAKE = gql`
  mutation ($name: String!) {
    createCarMake(input: {carMake: {name: $name}}) {
      carMake {
        id
        name
      }
    }
  }`;

export const UPDATE_CAR_MAKE = gql`
  mutation ($id: Int!, $name: String!) {
    updateCarMakeById(input: {id: $id, carMakePatch: {name: $name}}) {
      carMake {
        id, name
      }
    }
  }`;

export const DELETE_CAR_MAKE = gql`
  mutation ($id: Int!) {
    deleteCarMakeById(input: {id: $id}) {
      deletedCarMakeId
    }
  }`;

