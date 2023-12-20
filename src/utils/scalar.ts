import { GraphQLScalarType, Kind } from 'graphql';

export const DateScalar = new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    serialize(value: any) {
        if (value instanceof Date) {
            return value.getTime(); // Convert outgoing Date to integer for JSON
        }
        throw Error('GraphQL Date Scalar serializer expected a `Date` object');
    },
    parseValue(value: any) {
        if (typeof value === 'number') {
            return new Date(value); // Convert incoming integer to Date
        }
        throw new Error('GraphQL Date Scalar parser expected a `number`');
    },
    parseLiteral(ast: any) {
        if (ast.kind === Kind.INT) {
            // Convert hard-coded AST string to integer and then to Date
            return new Date(parseInt(ast.value, 10));
        }
        return null;
    },
});

export const JSONScalar = new GraphQLScalarType({
    name: 'JSON',
    description: 'Custom JSON scalar type',
    serialize(value: any) {
        return value; // JSON is serialized as-is
    },
    parseValue(value: any) {
        return value; // JSON is parsed as-is
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.OBJECT) {
            return ast.fields.reduce((obj: Record<string, any>, field: any) => {
                obj[field.name.value] = field.value.value;
                return obj;
            }, {});
        }
        return null;
    },
});