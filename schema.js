import { buildSchema } from 'graphql';
import db from './config/db.js';

// Define schema
export const schema = buildSchema(`
  type Zone {
    ZoneId: ID!
    Zone: String!
  }
  
  type User {
    UserId: ID!
    UserName: String!
    Admin: Int
    Active: String
  }
  
  type Query {
    zones: [Zone]
    zone(id: ID!): Zone
    users: [User]
    user(id: ID!): User
  }
  
  type Mutation {
    createZone(zone_name: String!): Zone
  }
`);

// Define resolvers
export const root = {
  zones: async () => {
    const [rows] = await db.query('SELECT * FROM zone');
    return rows;
  },
  zone: async ({ id }) => {
    const [rows] = await db.query('SELECT * FROM zone WHERE ZoneId = ?', [id]);
    return rows[0];
  },
  users: async () => {
    const [rows] = await db.query('SELECT UserId, UserName, Admin, Active FROM authentication');
    return rows;
  },
  user: async ({ id }) => {
    const [rows] = await db.query('SELECT UserId, UserName, Admin, Active FROM authentication WHERE UserId = ?', [id]);
    return rows[0];
  },
  createZone: async ({ zone_name }) => {
    const [result] = await db.query('INSERT INTO zone (Zone) VALUES (?)', [zone_name]);
    return { ZoneId: result.insertId, Zone: zone_name };
  }
};