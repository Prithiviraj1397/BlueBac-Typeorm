import { GraphQLError, GraphQLErrorOptions } from 'graphql';

const graphqlErrorHandler = (status: number, message: string = ''): GraphQLError => {
    const errorOptions: GraphQLErrorOptions = {
        extensions: {
            http: {
                status,
            },
        },
    };
    const error: GraphQLError = new GraphQLError(message, errorOptions);
    throw error;
};

export default graphqlErrorHandler;