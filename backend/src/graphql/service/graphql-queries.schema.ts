import { gql } from "@apollo/client";

export const LIST_MEMBERS = gql`
  query (
    $first: Int!, 
    $offset: Int!,
    $orderBy: MembersOrderBy!
    ) {
    allMembers(
      first: $first, 
      offset: $offset,
      orderBy: [$orderBy]
      ) {
      totalCount
      nodes {
        id
        firstName
        lastName
        email
        vin
        manufacturedDate
        carModelByCarModelId {
          id
          name
          carMakeByCarMakeId {
            id
            name
          }
        }
      }
    }
  }
`;

export const SEARCH_MEMBERS = gql`
  query (
    $first: Int!, 
    $offset: Int!,
    $query: String!,
    $orderBy: MembersOrderBy!
    ) {
    allMembers(
      first: $first, 
      offset: $offset,
      filter: {
        or: [
          {firstName: {likeInsensitive: $query}},
          {lastName: {likeInsensitive: $query}},
          {email: {likeInsensitive: $query}},
          {vin: {likeInsensitive: $query}},
          {carModelByCarModelId: {name: {likeInsensitive: $query}}},
          {carModelByCarModelId: {carMakeByCarMakeId: {name: {likeInsensitive: $query}}}}
        ]
      },
      orderBy: [$orderBy]
      ) {
      totalCount
      nodes {
        id
        firstName
        lastName
        email
        vin
        manufacturedDate
        carModelByCarModelId {
          id
          name
          carMakeByCarMakeId {
            id
            name
          }
        }
      }
    }
  }
`;

export const MEMBERS_BY_CAR_NEWER_THAN = gql`
query($minDate: Datetime) {
  allMembers(filter: { manufacturedDate: { greaterThanOrEqualTo: $minDate } }) {
    nodes {
        id
        firstName
        lastName
        email
        vin
        manufacturedDate
        carModelByCarModelId {
          id
          name
          carMakeByCarMakeId {
            id
            name
          }
        }
      }
    }
  }
`;

export const MEMBERS_BY_CAR_OLDER_THAN = gql`
query($maxDate: Datetime) {
  allMembers(filter: { manufacturedDate: { lessThanOrEqualTo: $maxDate } }) {
    nodes {
        id
        firstName
        lastName
        email
        vin
        manufacturedDate
        carModelByCarModelId {
          id
          name
          carMakeByCarMakeId {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_MEMBER_BY_NAME = gql`
  query (
    $firstName: String, 
    $lastName: String, 
    $vin: String
    ) {
  allMembers(condition: {
    firstName: $firstName, 
    lastName: $lastName, 
    vin: $vin}
    ) {
      totalCount
      nodes {
        id
        firstName
        lastName
        email
        vin
        manufacturedDate
        carModelByCarModelId {
          id
          name
          carMakeByCarMakeId {
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
        carModelByCarModelId {
          id
          name
          carMakeByCarMakeId {
            id
            name
          }
        }
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
        carModelByCarModelId {
          id
          name
          carMakeByCarMakeId {
            id
            name
          }
        }
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
        name,
        carMakeByCarMakeId {
          id
          name
        }
      }
    }
  }
`;
export const GET_CAR_MODEL_BY_NAME = gql`
  query ($name: String, $carMakeId: Int!) {
    allCarModels(condition: {name: $name, carMakeId: $carMakeId}) {
      nodes {
        id
        name
        carMakeByCarMakeId {
          id
          name
        }
      }
    }
  }
`;

export const CREATE_CAR_MODEL = gql`
  mutation ($carMakeId: Int!, $name: String!) {
    createCarModel(input: {carModel: {carMakeId: $carMakeId, name: $name}}) {
      carModel {
        id,
        name,
        carMakeByCarMakeId {
          id
          name
        }
      }
    }
  }
`;

export const UPDATE_CAR_MODEL = gql`
  mutation ($id: Int!, $carMakeId: Int!, $name: String!) {
    updateCarModelById(input: {id: $id, carModelPatch: {carMakeId: $carMakeId, name: $name}}) {
      carModel {
        id,
        name,
      }
    }
  }
`;

export const DELETE_CAR_MODEL = gql`
  mutation ($id: Int!) {
    deleteCarModelById(input: {id: $id}) {
      deletedCarModelId
    }
  }
`;


export const LIST_CAR_MAKE = gql`
  query {
    allCarMakes {
      nodes {
        id
        name
      }
    }
  }
`;

export const GET_CAR_MAKE_BY_NAME = gql`
  query ($name: String) {
    allCarMakes(condition: {name: $name}) {
      nodes {
        id
        name
      }
    }
  }
`;

export const CREATE_CAR_MAKE = gql`
  mutation ($name: String!) {
    createCarMake(input: {carMake: {name: $name}}) {
      carMake {
        id
        name
      }
    }
  }
`;

export const UPDATE_CAR_MAKE = gql`
  mutation ($id: Int!, $name: String!) {
    updateCarMakeById(input: {id: $id, carMakePatch: {name: $name}}) {
      carMake {
        id, name
      }
    }
  }
`;

export const DELETE_CAR_MAKE = gql`
  mutation ($id: Int!) {
    deleteCarMakeById(input: {id: $id}) {
      deletedCarMakeId
    }
  }
`;
