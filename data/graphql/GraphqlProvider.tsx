
import { ApolloProvider, type ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { ReactNode } from "react";

const GraphqlProvider = ({
    apolloClient,
    children,
}: {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    children: ReactNode;
}) => {
    return (
        <>
            {apolloClient &&
                <ApolloProvider client={apolloClient} >
                    {children}
                </ApolloProvider>
            }
        </>
    );
}

export default GraphqlProvider;