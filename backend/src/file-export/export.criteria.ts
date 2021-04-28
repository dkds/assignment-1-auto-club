import { gql } from "@apollo/client";

export const EXPORT_CRITERIA = [
  {
    code: 'CAR_NEWER_THAN',
    text: 'Members with cars newer than X years',
    query: gql`
    query($age: Int!) {
      membersByCarAgeLessThan(age: $age) {
        nodes {
          id
          firstName
          lastName
          email
          mfd
          vin
          carModel {
            name
            carMake {
              name
            }
          }
        }
      }
    }
    `
  },
  {
    code: 'CAR_OLDER_THAN',
    text: 'Members with cars older than X years',
    query: gql`
    query($age: Int!) {
      membersByCarAgeMoreThan(age: $age) {
        nodes {
          id
          firstName
          lastName
          email
          mfd
          vin
          carModel {
            name
            carMake {
              name
            }
          }
        }
      }
    }
    `
  }
]