
const toSingleLine = (query: string) => {
  return query.split("\n").join('');
}

export const GET_CAR_MAKE_BY_ID = {
  query: toSingleLine(`
    query ($id: Int!) {
        carMakeById (id: $id) {
            id
            name
        }
    }
    `),
  variables: { id: null },
};

export const GET_CAR_MAKE_BY_NAME = {
  query: toSingleLine(`
    query ($name: String!) {
        allCarMakes (condition: {name: $name}) {
            nodes {
                id
                name
            }
        }
    }   
    `),
  variables: { name: null },
};

export const GET_CAR_MODEL_BY_ID = {
  query: toSingleLine(`
    query ($id: Int!) {
        carModelById (id: $id) {
            id
            name
            carMakeId
        }
    }
    `),
  variables: { id: null },
};

export const GET_CAR_MODEL_BY_NAME = {
  query: toSingleLine(`
    query ($name: String!, $carMakeId: Int!) {
        allCarModels(condition: {name: $name, carMakeId: $carMakeId}) {
            nodes {
                id,
                carMakeId
                name
            }
        }
    }
    `),
  variables: { name: null, carMakeId: null },
};

export const GET_MEMBERS = {
  query: toSingleLine(`
    query ($first: Int!) {
        allMembers(first: $first) {
            nodes {
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
    `),
  variables: { first: null },
};

export const GET_MEMBERS_BY_AGE = {
  query: toSingleLine(`
    query ($first: Int!) {
        allMembers(first: $first) {
            nodes {
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
    `),
  variables: { first: null },
};

export const GET_MEMBER_BY_NAME = {
  query: toSingleLine(`
    query ($firstName: String!, $lastName: String!, $vin: String!) {
        allMembers(condition: {
            firstName: $firstName, 
            lastName: $lastName, 
            vin: $vin }) {
            nodes {
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
    `),
  variables: { firstName: null, lastName: null, vin: null },
};

export const CREATE_MEMBER = {
  query: toSingleLine(`
    mutation (
        $firstName: String!, 
        $lastName: String!, 
        $email: String!, 
        $vinNumber: String!, 
        $mfd: Datetime!, 
        $carModelId: Int!
      ) {
        createMember(input: {member: {
          firstName: $firstName, 
          lastName: $lastName, 
          email: $email, 
          vin: $vinNumber, 
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
    `),
  variables: {
    firstName: null,
    lastName: null,
    email: null,
    vinNumber: null,
    mfd: null,
    carModelId: null
  },
};

export const CREATE_CAR_MAKE = {
  query: toSingleLine(`
    mutation ($name: String!) {
        createCarMake(input: {carMake: {name: $name}}) {
            carMake {
                id,
                name
            }
        }
    }
    `),
  variables: { name: null },
};

export const CREATE_CAR_MODEL = {
  query: toSingleLine(`
    mutation ($carMakeId: Int!, $name: String!) {
        createCarModel(input: {carModel: {carMakeId: $carMakeId, name: $name}}) {
          carModel {
            id
            carMakeId
            name
          }
        }
      }      
    `),
  variables: { name: null, carMakeId: null },
};