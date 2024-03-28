const fetchRefreshToken = (options:any) =>
  fetch(process.env["NEXT_PUBLIC_GRAPHQL_URL"] + "", {
    ...options,
    withCredentials: true,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
       query {
        refreshToken {
            access_token
            status
            message
        }
      }
      `,
    }),
  }).then((res) => res.json());

export default fetchRefreshToken;
